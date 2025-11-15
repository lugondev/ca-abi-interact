import { useCallback, useEffect, useState, useRef } from "react";
import { usePublicClient } from "wagmi";
import { walletModel } from "@entities/wallet";
import { TAddress, isEvmAddress } from "@shared/lib/web3";
import { TNativeValue, TTransactionParams } from "@shared/lib/tx";
import { TAbiFunction, TContract } from "@entities/contract";
import { useInitialTransactionParams } from "./useInitialTransactionParams";

export const useTransactionParamsForm = (
  contract: TContract,
  abiItem: TAbiFunction,
  args: string[]
) => {
  const publicClient = usePublicClient();
  const { address } = walletModel.useCurrentWallet();

  const initialValues = useInitialTransactionParams(contract, abiItem, args);
  const [values, setValues] = useState<TTransactionParams>(() => ({
    from: address || "0x0000000000000000000000000000000000000000" as TAddress,
    nonce: 0,
    value: "0",
    gas: 21000,
    ...initialValues,
  } as TTransactionParams));
  
  // Track if we've estimated gas for the current transaction data
  const estimatedGasRef = useRef<string>("");

  const updateNonce = useCallback(
    (address: TAddress) => {
      publicClient
        ?.getTransactionCount({ address })
        .then((value) => setValues((prev) => ({ ...prev, nonce: value })));
    },
    [publicClient]
  );

  const updateGasLimit = useCallback(
    (address: TAddress, value: TNativeValue | undefined, txValues: TTransactionParams) => {
      if (!txValues.to || !txValues.data || !publicClient) {
        console.log("Gas estimation skipped:", { 
          hasTo: !!txValues.to, 
          hasData: !!txValues.data, 
          hasPublicClient: !!publicClient 
        });
        return;
      }
      
      if (!isEvmAddress(address) || address === "0x0000000000000000000000000000000000000000") {
        console.log("Gas estimation skipped: invalid address", address);
        return;
      }
      
      // Create a unique key for this transaction to avoid duplicate estimates
      const txKey = `${address}-${txValues.to}-${txValues.data}-${value || txValues.value || 0}`;
      if (estimatedGasRef.current === txKey) {
        console.log("Gas estimation skipped: already estimated for this transaction");
        return; // Already estimated for this transaction
      }
      
      console.log("Estimating gas limit...", { address, to: txValues.to, data: txValues.data.substring(0, 20) + "..." });
      estimatedGasRef.current = txKey;
      
      publicClient
        .estimateGas({
          account: address as `0x${string}`,
          to: txValues.to,
          data: txValues.data,
          value: BigInt(value || txValues.value || 0),
        })
        .then((gasValue) => {
          console.log("Gas estimation successful:", Number(gasValue));
          setValues((prev) => ({ ...prev, gas: Number(gasValue) }));
        })
        .catch((error) => {
          console.error("Gas estimation error:", error);
          // Keep the previous gas value or set a default if estimation fails
          setValues((prev) => ({ ...prev, gas: prev.gas || 21000 }));
          // Reset the ref so we can retry
          estimatedGasRef.current = "";
        });
    },
    [publicClient]
  );

  const onValuesChange = useCallback(
    (changed: Partial<TTransactionParams>) => {
      setValues((prev) => {
        const newValues = { ...prev, ...changed };
        
        // Trigger async updates after state is updated
        // Use queueMicrotask to ensure state is updated first
        queueMicrotask(() => {
          const fromAddress = changed.from || prev.from;
          const shouldUpdateGas = 
            changed.from || 
            changed.value || 
            changed.to || 
            changed.data;

          if (changed.from && isEvmAddress(changed.from)) {
            updateNonce(changed.from);
          }

          // Update gas limit when relevant fields change
          if (shouldUpdateGas && fromAddress && isEvmAddress(fromAddress)) {
            updateGasLimit(
              fromAddress, 
              changed.value || prev.value, 
              newValues
            );
          }
        });
        
        return newValues;
      });
    },
    [updateGasLimit, updateNonce]
  );

  // Update nonce and gas when address changes
  useEffect(() => {
    if (address && isEvmAddress(address)) {
      onValuesChange({ from: address });
    }
  }, [address, onValuesChange]);

  // Update values when initialValues change (e.g., when args change)
  useEffect(() => {
    if (initialValues.data || initialValues.to || initialValues.maxFee || initialValues.maxPriorityFee) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues.data, initialValues.to, initialValues.maxFee, initialValues.maxPriorityFee]);

  // Estimate gas when transaction data is ready
  useEffect(() => {
    const hasData = values.data && values.data !== "0x";
    const hasTo = values.to && isEvmAddress(values.to);
    const hasFrom = values.from && isEvmAddress(values.from) && values.from !== "0x0000000000000000000000000000000000000000";
    const hasPublicClient = !!publicClient;
    
    console.log("Gas estimation useEffect check:", { 
      hasData, 
      hasTo, 
      hasFrom, 
      hasPublicClient,
      data: values.data?.substring(0, 20),
      to: values.to,
      from: values.from,
      currentGas: values.gas
    });
    
    if (hasData && hasTo && hasFrom && hasPublicClient) {
      // Reset ref to allow estimation when transaction changes
      const txKey = `${values.from}-${values.to}-${values.data}-${values.value || 0}`;
      if (estimatedGasRef.current !== txKey) {
        estimatedGasRef.current = "";
        // Estimate gas when transaction data is ready
        console.log("Triggering gas estimation from useEffect");
        updateGasLimit(values.from, values.value, values);
      }
    }
  }, [values.data, values.to, values.from, values.value, publicClient, updateGasLimit]);

  return {
    values,
    onValuesChange,
    initialValues,
    payable: abiItem.stateMutability == "payable",
  };
};
