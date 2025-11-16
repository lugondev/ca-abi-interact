import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomChains, useCurrentChain, useChainConfig } from "@entities/chain";
import { Plus, Trash2, RotateCcw } from "lucide-react";

export const ChainRpcSettings = () => {
  const { chain: currentChainId } = useCurrentChain();
  const chainConfig = useChainConfig(currentChainId);
  const { chainRpcOverrides, updateChainRpc, resetChainRpc } = useCustomChains();
  
  const currentRpcOverride = chainRpcOverrides[currentChainId];
  const [rpcList, setRpcList] = useState<string[]>(
    currentRpcOverride || chainConfig.rpc
  );

  useEffect(() => {
    setRpcList(currentRpcOverride || chainConfig.rpc);
  }, [currentChainId, currentRpcOverride, chainConfig.rpc]);

  const handleRpcChange = (index: number, value: string) => {
    const newRpc = [...rpcList];
    newRpc[index] = value;
    setRpcList(newRpc);
  };

  const handleAddRpc = () => {
    setRpcList([...rpcList, ""]);
  };

  const handleRemoveRpc = (index: number) => {
    if (rpcList.length > 1) {
      setRpcList(rpcList.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const filteredRpc = rpcList.filter((rpc) => rpc.trim() !== "");
    if (filteredRpc.length > 0) {
      updateChainRpc(currentChainId, filteredRpc);
    }
  };

  const handleReset = () => {
    resetChainRpc(currentChainId);
    setRpcList(chainConfig.rpc);
  };

  const hasChanges = () => {
    const filteredRpc = rpcList.filter((rpc) => rpc.trim() !== "");
    const originalRpc = currentRpcOverride || chainConfig.rpc;
    return JSON.stringify(filteredRpc) !== JSON.stringify(originalRpc);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RPC Settings</CardTitle>
        <CardDescription>
          Modify RPC endpoints for {chainConfig.name} (Chain ID: {currentChainId})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>RPC URLs</Label>
          {rpcList.map((rpc, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={rpc}
                onChange={(e) => handleRpcChange(index, e.target.value)}
                placeholder="https://rpc.example.com"
              />
              {rpcList.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRpc(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRpc}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add RPC URL
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges()}
            className="flex-1"
          >
            Save Changes
          </Button>
          {currentRpcOverride && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          )}
        </div>

        {currentRpcOverride && (
          <p className="text-sm text-muted-foreground">
            This chain is using custom RPC endpoints. Click "Reset to Default" to restore original RPCs.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

