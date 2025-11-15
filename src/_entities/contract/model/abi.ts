import { useMemo } from "react";
import {
  isAbiItemProperty,
  isAbiItemOperation,
  isAbiItemParamCall,
  isAbiItemEvent,
  isAbiItemConstructor,
  isAbiItemHidden,
} from "../lib";
import { TAbiItem, TContract } from "./types";

export const useContractProperties = (contract: TContract) => {
  return useMemo(
    () =>
      contract.abi.filter(
        (item) => isAbiItemProperty(item) && !isAbiItemHidden(item, contract.hiddenAbiItems)
      ),
    [contract.abi, contract.hiddenAbiItems]
  );
};

export const useContractParamCalls = (contract: TContract) => {
  return useMemo(
    () =>
      contract.abi.filter(
        (item) => isAbiItemParamCall(item) && !isAbiItemHidden(item, contract.hiddenAbiItems)
      ),
    [contract.abi, contract.hiddenAbiItems]
  );
};

export const useContractOperations = (contract: TContract) => {
  return useMemo(
    () =>
      contract.abi.filter(
        (item) => isAbiItemOperation(item) && !isAbiItemHidden(item, contract.hiddenAbiItems)
      ),
    [contract.abi, contract.hiddenAbiItems]
  );
};

export const useContractEvents = (contract: TContract) => {
  return useMemo(
    () =>
      contract.abi.filter(
        (item) => isAbiItemEvent(item) && !isAbiItemHidden(item, contract.hiddenAbiItems)
      ),
    [contract.abi, contract.hiddenAbiItems]
  );
};

export const useContractConstructor = (abi: TAbiItem[]) => {
  return useMemo(() => {
    const ctors = abi.filter(isAbiItemConstructor);
    return ctors.length ? ctors[0] : null;
  }, [abi]);
};
