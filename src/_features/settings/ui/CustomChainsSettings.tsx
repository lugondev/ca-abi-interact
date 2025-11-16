import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCustomChains, useChainListSafe, TChain } from "@entities/chain";
import { Plus, Trash2 } from "lucide-react";

export const CustomChainsSettings = () => {
  const { customChains, addCustomChain, removeCustomChain } = useCustomChains();
  const allChains = useChainListSafe();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<TChain>>({
    name: "",
    chain: "",
    chainId: 0,
    rpc: [""],
    nativeCurrency: {
      name: "",
      symbol: "",
      decimals: 18,
    },
    explorers: [{ name: "", url: "" }],
  });

  const handleAddRpc = () => {
    setFormData({
      ...formData,
      rpc: [...(formData.rpc || []), ""],
    });
  };

  const handleRemoveRpc = (index: number) => {
    setFormData({
      ...formData,
      rpc: formData.rpc?.filter((_, i) => i !== index) || [],
    });
  };

  const handleRpcChange = (index: number, value: string) => {
    const newRpc = [...(formData.rpc || [])];
    newRpc[index] = value;
    setFormData({ ...formData, rpc: newRpc });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.chainId ||
      !formData.rpc ||
      formData.rpc.length === 0 ||
      !formData.nativeCurrency?.symbol
    ) {
      return;
    }

    // At this point, we know nativeCurrency exists due to the check above
    const nativeCurrency = formData.nativeCurrency!;

    const chain: TChain = {
      name: formData.name,
      chain: formData.chain || formData.name,
      chainId: formData.chainId,
      rpc: formData.rpc.filter((r) => r.trim() !== ""),
      nativeCurrency: {
        name: nativeCurrency.name || "",
        symbol: nativeCurrency.symbol || "",
        decimals: nativeCurrency.decimals || 18,
      },
      explorers: formData.explorers?.filter((e) => e.name && e.url) || [],
    };

    addCustomChain(chain);
    setIsDialogOpen(false);
    setFormData({
      name: "",
      chain: "",
      chainId: 0,
      rpc: [""],
      nativeCurrency: {
        name: "",
        symbol: "",
        decimals: 18,
      },
      explorers: [{ name: "", url: "" }],
    });
  };

  const isChainIdExists = (chainId: number) => {
    return allChains.some((c) => c.chainId === chainId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Chains</CardTitle>
        <CardDescription>
          Add custom blockchain networks to interact with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Chain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Custom Chain</DialogTitle>
              <DialogDescription>
                Enter the details for your custom blockchain network.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chain-name">Chain Name *</Label>
                <Input
                  id="chain-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="E.g., My Custom Chain"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chain-id">Chain ID *</Label>
                <Input
                  id="chain-id"
                  type="number"
                  value={formData.chainId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chainId: Number(e.target.value),
                    })
                  }
                  placeholder="E.g., 12345"
                  required
                />
                {formData.chainId && isChainIdExists(formData.chainId) && (
                  <p className="text-sm text-yellow-600">
                    Warning: A chain with this ID already exists. It will be
                    replaced.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chain">Chain Type</Label>
                <Input
                  id="chain"
                  value={formData.chain}
                  onChange={(e) =>
                    setFormData({ ...formData, chain: e.target.value })
                  }
                  placeholder="E.g., ETH, BSC, Polygon"
                />
              </div>

              <div className="space-y-2">
                <Label>RPC URLs *</Label>
                {formData.rpc?.map((rpc, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={rpc}
                      onChange={(e) => handleRpcChange(index, e.target.value)}
                      placeholder="https://rpc.example.com"
                      required={index === 0}
                    />
                    {formData.rpc && formData.rpc.length > 1 && (
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

              <div className="space-y-2">
                <Label htmlFor="native-currency-name">
                  Native Currency Name
                </Label>
                <Input
                  id="native-currency-name"
                  value={formData.nativeCurrency?.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nativeCurrency: {
                        name: e.target.value,
                        symbol: formData.nativeCurrency?.symbol || "",
                        decimals: formData.nativeCurrency?.decimals || 18,
                      },
                    })
                  }
                  placeholder="E.g., Ether"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="native-currency-symbol">
                  Native Currency Symbol *
                </Label>
                <Input
                  id="native-currency-symbol"
                  value={formData.nativeCurrency?.symbol || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nativeCurrency: {
                        name: formData.nativeCurrency?.name || "",
                        symbol: e.target.value,
                        decimals: formData.nativeCurrency?.decimals || 18,
                      },
                    })
                  }
                  placeholder="E.g., ETH"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="native-currency-decimals">
                  Native Currency Decimals
                </Label>
                <Input
                  id="native-currency-decimals"
                  type="number"
                  value={formData.nativeCurrency?.decimals || 18}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nativeCurrency: {
                        name: formData.nativeCurrency?.name || "",
                        symbol: formData.nativeCurrency?.symbol || "",
                        decimals: Number(e.target.value),
                      },
                    })
                  }
                  placeholder="18"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Chain
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {customChains.length > 0 && (
          <div className="space-y-2">
            <Label>Custom Chains ({customChains.length})</Label>
            <div className="space-y-2">
              {customChains.map((chain) => (
                <div
                  key={chain.chainId}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{chain.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Chain ID: {chain.chainId}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomChain(chain.chainId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
