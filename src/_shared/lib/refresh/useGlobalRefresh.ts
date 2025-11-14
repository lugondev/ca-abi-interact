import { useEffect, useRef } from "react";
import { useRefreshContext } from "./RefreshContext";

type UseGlobalRefreshOptions = {
  id: string;
  onRefresh: () => void;
  enabled?: boolean;
};

export const useGlobalRefresh = ({ id, onRefresh, enabled = true }: UseGlobalRefreshOptions) => {
  const { registerRefresh, unregisterRefresh } = useRefreshContext();
  const onRefreshRef = useRef(onRefresh);

  // Keep the ref updated
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (enabled) {
      registerRefresh(id, () => onRefreshRef.current());
      return () => unregisterRefresh(id);
    } else {
      unregisterRefresh(id);
    }
  }, [id, enabled, registerRefresh, unregisterRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => unregisterRefresh(id);
  }, [id, unregisterRefresh]);
};
