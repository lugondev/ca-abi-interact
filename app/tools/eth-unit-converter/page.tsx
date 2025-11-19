"use client";

import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function EthUnitConverter() {
  const [wei, setWei] = useState<string>("");
  const [gwei, setGwei] = useState<string>("");
  const [ether, setEther] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleWeiChange = (value: string) => {
    setWei(value);
    if (!value) {
      setGwei("");
      setEther("");
      return;
    }
    try {
      const val = BigInt(value);
      setGwei(formatUnits(val, 9));
      setEther(formatUnits(val, 18));
    } catch (e) {
      // Ignore invalid input
    }
  };

  const handleGweiChange = (value: string) => {
    setGwei(value);
    if (!value) {
      setWei("");
      setEther("");
      return;
    }
    try {
      const val = parseUnits(value, 9);
      setWei(val.toString());
      setEther(formatUnits(val, 18));
    } catch (e) {
      // Ignore invalid input
    }
  };

  const handleEtherChange = (value: string) => {
    setEther(value);
    if (!value) {
      setWei("");
      setGwei("");
      return;
    }
    try {
      const val = parseUnits(value, 18);
      setWei(val.toString());
      setGwei(formatUnits(val, 9));
    } catch (e) {
      // Ignore invalid input
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Eth Unit Converter</CardTitle>
          <CardDescription>
            Convert between Wei, Gwei, and Ether.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ether">Ether</Label>
            <div className="flex gap-2">
              <Input
                id="ether"
                placeholder="1"
                value={ether}
                onChange={(e) => handleEtherChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(ether, "ether")}
                disabled={!ether}
              >
                {copied === "ether" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gwei">Gwei</Label>
            <div className="flex gap-2">
              <Input
                id="gwei"
                placeholder="1000000000"
                value={gwei}
                onChange={(e) => handleGweiChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(gwei, "gwei")}
                disabled={!gwei}
              >
                {copied === "gwei" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wei">Wei</Label>
            <div className="flex gap-2">
              <Input
                id="wei"
                placeholder="1000000000000000000"
                value={wei}
                onChange={(e) => handleWeiChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wei, "wei")}
                disabled={!wei}
              >
                {copied === "wei" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
