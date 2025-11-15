import { useCallback } from "react";
import { contractModel, TContract, TAbiItem } from "@entities/contract";
import { getAbiItemSignature } from "@entities/contract/lib";

export const useManageAbiFunctions = (contract: TContract) => {
  const { update } = contractModel.useContracts();

  const addAbiItem = useCallback(
    (item: TAbiItem) => {
      const newAbi = [...contract.abi, item];
      update(contract.id, undefined, undefined, undefined, newAbi);
    },
    [contract, update]
  );

  const removeAbiItem = useCallback(
    (index: number) => {
      const newAbi = contract.abi.filter((_, i) => i !== index);
      update(contract.id, undefined, undefined, undefined, newAbi);
    },
    [contract, update]
  );

  const updateAbiItem = useCallback(
    (index: number, item: TAbiItem) => {
      const newAbi = [...contract.abi];
      newAbi[index] = item;
      update(contract.id, undefined, undefined, undefined, newAbi);
    },
    [contract, update]
  );

  const toggleHideAbiItem = useCallback(
    (item: TAbiItem) => {
      const signature = getAbiItemSignature(item);
      const currentHidden = contract.hiddenAbiItems || [];
      const isHidden = currentHidden.includes(signature);
      
      const newHiddenAbiItems = isHidden
        ? currentHidden.filter((s) => s !== signature)
        : [...currentHidden, signature];
      
      update(contract.id, undefined, undefined, undefined, undefined, newHiddenAbiItems);
    },
    [contract, update]
  );

  return {
    addAbiItem,
    removeAbiItem,
    updateAbiItem,
    toggleHideAbiItem,
  };
};

