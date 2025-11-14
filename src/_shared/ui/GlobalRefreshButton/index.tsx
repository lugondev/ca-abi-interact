import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRefreshContext, useAutoRefresh } from "@shared/lib/refresh";
import { useSettings } from "@entities/settings";

type TProps = {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
};

export const GlobalRefreshButton = ({ className, size = "sm", variant = "outline" }: TProps) => {
  const { refreshAll, refreshCount, isRefreshing } = useRefreshContext();
  const { settings } = useSettings();

  // Auto-refresh for global refresh (applies to all properties at once)
  useAutoRefresh({
    onRefresh: refreshAll,
  });

  // Don't show the button if there are no items to refresh or if auto-refresh is enabled
  if (refreshCount === 0 || settings.refresh.enabled) {
    return null;
  }

  return (
    <Button 
      onClick={refreshAll} 
      variant={variant} 
      size={size}
      className={className}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : `Refresh All (${refreshCount})`}
    </Button>
  );
};
