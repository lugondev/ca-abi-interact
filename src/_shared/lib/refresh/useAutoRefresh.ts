import { useEffect, useRef } from "react";
import { useSettings } from "@entities/settings";

type TAutoRefreshOptions = {
  onRefresh: () => void;
  enabled?: boolean; // Override global setting
};

export const useAutoRefresh = ({ onRefresh, enabled }: TAutoRefreshOptions) => {
  const { settings } = useSettings();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const isEnabled = enabled !== undefined ? enabled : settings.refresh.enabled;
  const interval = settings.refresh.interval * 1000; // convert to milliseconds

  useEffect(() => {
    if (isEnabled && onRefresh) {
      intervalRef.current = setInterval(() => {
        onRefresh();
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }

    // Clean up if disabled
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isEnabled, interval, onRefresh]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isAutoRefreshEnabled: isEnabled,
    refreshInterval: settings.refresh.interval,
  };
};
