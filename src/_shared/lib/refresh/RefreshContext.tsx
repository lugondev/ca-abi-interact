import React, { createContext, useContext, useCallback, useRef, useState } from "react";

type RefreshFunction = () => void;

interface RefreshContextType {
  registerRefresh: (id: string, refreshFn: RefreshFunction) => void;
  unregisterRefresh: (id: string) => void;
  refreshAll: () => void;
  refreshCount: number;
  isRefreshing: boolean;
}

const RefreshContext = createContext<RefreshContextType | null>(null);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const refreshFunctions = useRef<Map<string, RefreshFunction>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const registerRefresh = useCallback((id: string, refreshFn: RefreshFunction) => {
    refreshFunctions.current.set(id, refreshFn);
    setRefreshCount(refreshFunctions.current.size);
  }, []);

  const unregisterRefresh = useCallback((id: string) => {
    refreshFunctions.current.delete(id);
    setRefreshCount(refreshFunctions.current.size);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Execute all refresh functions
      refreshFunctions.current.forEach((refreshFn) => {
        refreshFn();
      });
      
      // Wait a minimum time to show the animation
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <RefreshContext.Provider value={{ registerRefresh, unregisterRefresh, refreshAll, refreshCount, isRefreshing }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefreshContext must be used within a RefreshProvider");
  }
  return context;
};
