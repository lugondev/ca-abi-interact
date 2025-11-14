import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { TContract, TAbiFunction } from "@entities/contract";
import { ParamValue, MultipleOutputsValue } from "@entities/contract";
import { chainModel } from "@entities/chain";
import { useContractCall } from "../model";
import { RefreshCw } from "lucide-react";
import { useGlobalRefresh } from "@shared/lib/refresh";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
};

export const PropertyCall = ({ contract, abiItem }: TProps) => {
  const { data, error, loading, refetch } = useContractCall(
    contract,
    abiItem,
    []
  );
  const { getAddressUrl } = chainModel.useChainExplorer(contract.chain);
  
  // Register with global refresh (individual properties don't use auto-refresh)
  useGlobalRefresh({
    id: `${contract.address}-${abiItem.name}`,
    onRefresh: refetch,
  });

  // Prepare output params for rendering
  const hasMultipleOutputs = abiItem.outputs && abiItem.outputs.length > 1;
  const outputParam = abiItem.outputs?.[0];
  const outputType = outputParam?.type;
  const explorerUrl = outputType === "address" ? getAddressUrl(data as any) : undefined;

  return (
    <div className="flex items-start gap-2 w-full min-w-0">
      <Button 
        onClick={() => refetch()} 
        variant="outline" 
        size="sm" 
        className="flex-shrink-0 h-7 w-7 p-0"
        disabled={loading}
      >
        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
      </Button>
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : hasMultipleOutputs ? (
          // Handle multiple outputs
          <MultipleOutputsValue
            outputs={abiItem.outputs}
            value={data}
            chain={contract.chain}
            shorten={false}
          />
        ) : (
          // Single output
          <ParamValue 
            value={data} 
            abiType={outputType} 
            chain={contract.chain} 
            shorten={false}
            explorerUrl={explorerUrl}
            abiParam={outputParam}
          />
        )}
      </div>
    </div>
  );
};
