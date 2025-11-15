import { TContract, TContractWithoutId, contractModel } from "@entities/contract";
import { useCallback } from "react";

export const useDuplicateContract = (contract: TContract) => {
  const { add, setCurrent } = contractModel.useContracts();

  return useCallback(
    ({ chain, name, address, abi }: TContractWithoutId) => {
      const { id } = add(chain, address, name, abi);
      setCurrent(id);
    },
    [add, setCurrent]
  );
};

