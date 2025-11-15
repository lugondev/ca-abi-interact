import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { TAbiItem, TContract, contractUtils } from "@entities/contract";

export const useContractCall = (
  contract: TContract,
  abiItem: TAbiItem,
  args: string[]
) => {
  // Parse args for arrays and tuples
  const parsedArgs = useMemo(() => {
    if (abiItem.type === "function" && "inputs" in abiItem) {
      return contractUtils.parseFunctionArgs(args, abiItem.inputs);
    }
    return args;
  }, [args, abiItem]);

  const { data, error, isLoading, refetch } = useReadContract({
    address: contract.address,
    abi: contract.abi,
    //@ts-ignore somehow TS thinks functionName is of undefined type
    functionName: abiItem.name,
    chainId: contract.chain,
    args: parsedArgs,
  });

  return {
    data,
    error,
    loading: isLoading,
    refetch,
  };
};
