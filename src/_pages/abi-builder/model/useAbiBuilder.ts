import { useState, useCallback } from "react";
import { TAbiItem, TAbiParam } from "@entities/contract";

export const useAbiBuilder = () => {
  const [abiItems, setAbiItems] = useState<TAbiItem[]>([]);

  const addAbiItem = useCallback((item: TAbiItem) => {
    setAbiItems((prev) => [...prev, item]);
  }, []);

  const removeAbiItem = useCallback((index: number) => {
    setAbiItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateAbiItem = useCallback((index: number, item: TAbiItem) => {
    setAbiItems((prev) => prev.map((existing, i) => (i === index ? item : existing)));
  }, []);

  const clearAll = useCallback(() => {
    setAbiItems([]);
  }, []);

  const exportAbi = useCallback(() => {
    return JSON.stringify(abiItems, null, 2);
  }, [abiItems]);

  const importAbi = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        setAbiItems(parsed);
      } else {
        setAbiItems([parsed]);
      }
    } catch (error) {
      throw new Error("Invalid ABI JSON");
    }
  }, []);

  return {
    abiItems,
    addAbiItem,
    removeAbiItem,
    updateAbiItem,
    clearAll,
    exportAbi,
    importAbi,
  };
};

