import { useCallback, useEffect, useState } from "react";
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
      if (!txValues.to || !txValues.data) return;
      
      publicClient
        ?.estimateGas({
          account: address,
          to: txValues.to,
          data: txValues.data,
          value: BigInt(value || 0),
        })
        .then((gasValue) => setValues((prev) => ({ ...prev, gas: Number(gasValue) })))
        .catch(() => setValues((prev) => ({ ...prev, gas: 0 })));
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
          if (changed.from && isEvmAddress(changed.from)) {
            updateNonce(changed.from);
            updateGasLimit(changed.from, undefined, newValues);
          }

          if (changed.value) {
            const fromAddress = changed.from || prev.from;
            if (fromAddress && isEvmAddress(fromAddress)) {
              updateGasLimit(fromAddress, changed.value, newValues);
            }
          }
        });
        
        return newValues;
      });
    },
    [updateGasLimit, updateNonce]
  );

  useEffect(() => {
    if (address) {
      onValuesChange({ from: address });
    }
  }, [address, onValuesChange]);

  return {
    values,
    onValuesChange,
    initialValues,
    payable: abiItem.stateMutability == "payable",
  };
};
