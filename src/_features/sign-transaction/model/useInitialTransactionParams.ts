import { useMemo } from "react";
import { useEstimateFeesPerGas } from "wagmi";
import { TTransactionParams } from "@shared/lib/tx";
import { encodeFunctionData } from "viem";
import { TAbiFunction, TContract, contractUtils } from "@entities/contract";

export const useInitialTransactionParams = (
  contract: TContract,
  abiItem: TAbiFunction,
  args: string[]
) => {
  const { data: feeData } = useEstimateFeesPerGas({
    chainId: contract.chain,
  });

  return useMemo(() => {
    const parsedArgs = contractUtils.parseFunctionArgs(args, abiItem.inputs);

    const values: Partial<TTransactionParams> = {
      data: encodeFunctionData({
        abi: contract.abi,
        args: parsedArgs,
        functionName: abiItem.name,
      }),
      to: contract.address,
      maxFee: "0",
      maxPriorityFee: "0",
    };

    if (feeData?.maxFeePerGas) {
      values.maxFee = feeData.maxFeePerGas.toString();
    }

    if (feeData?.maxPriorityFeePerGas) {
      values.maxPriorityFee = feeData.maxPriorityFeePerGas.toString();
    }

    return values;
  }, [
    abiItem.inputs,
    abiItem.name,
    args,
    contract.abi,
    contract.address,
    feeData?.maxFeePerGas,
    feeData?.maxPriorityFeePerGas,
  ]);
};
