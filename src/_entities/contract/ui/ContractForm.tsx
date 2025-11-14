import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChainSelect, chainModel } from "@entities/chain";
import { TContractWithoutId } from "../model/types";

type TProps = {
  onSubmit: (_values: TContractWithoutId) => void;
  buttonText: string;
  value?: TContractWithoutId;
};

export const ContractForm = ({ buttonText, value, onSubmit }: TProps) => {
  const { chain } = chainModel.useCurrentChain();

  const initialValue = value || { chain, abi: [], name: "", address: "" };

  const [formData, setFormData] = useState({
    chain: initialValue.chain,
    name: initialValue.name,
    address: initialValue.address,
    abi: JSON.stringify(initialValue.abi, null, 2),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Contract name missing";
    if (!formData.address) newErrors.address = "Contract address missing";
    if (!formData.abi) newErrors.abi = "Contract ABI missing";
    
    try {
      if (formData.abi) {
        JSON.parse(formData.abi);
      }
    } catch (err) {
      newErrors.abi = "Invalid JSON format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      chain: formData.chain,
      name: formData.name,
      address: formData.address,
      abi: JSON.parse(formData.abi),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="chain" className="text-sm">Chain</Label>
        <ChainSelect
          value={formData.chain}
          onChange={(chain) => setFormData({ ...formData, chain })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Contract name"
          className="text-sm"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="0x..."
          className="text-sm"
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="abi" className="text-sm">ABI</Label>
        <Textarea
          id="abi"
          rows={8}
          value={formData.abi}
          onChange={(e) => setFormData({ ...formData, abi: e.target.value })}
          placeholder="Contract ABI JSON"
          className="font-mono text-xs"
        />
        {errors.abi && (
          <p className="text-xs text-destructive">{errors.abi}</p>
        )}
      </div>

      <Button type="submit" className="w-full text-sm">
        {buttonText}
      </Button>
    </form>
  );
};
