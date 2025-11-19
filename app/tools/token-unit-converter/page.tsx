"use client";

import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function TokenUnitConverter() {
  const [decimals, setDecimals] = useState<string>("18");
  const [amount, setAmount] = useState<string>("");
  const [rawAmount, setRawAmount] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDecimalsChange = (value: string) => {
    setDecimals(value);
    // Recalculate raw amount if amount exists
    if (amount && value) {
      try {
        const val = parseUnits(amount, parseInt(value));
        setRawAmount(val.toString());
      } catch (e) {
        // Ignore
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (!value) {
      setRawAmount("");
      return;
    }
    try {
      const val = parseUnits(value, parseInt(decimals));
      setRawAmount(val.toString());
    } catch (e) {
      // Ignore
    }
  };

  const handleRawAmountChange = (value: string) => {
    setRawAmount(value);
    if (!value) {
      setAmount("");
      return;
    }
    try {
      const val = BigInt(value);
      setAmount(formatUnits(val, parseInt(decimals)));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Token Unit Converter</CardTitle>
          <CardDescription>
            Convert ERC20 token amounts with custom decimals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="decimals">Token Decimals</Label>
            <Input
              id="decimals"
              type="number"
              placeholder="18"
              value={decimals}
              onChange={(e) => handleDecimalsChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Human Readable)</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                placeholder="1.5"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(amount, "amount")}
                disabled={!amount}
              >
                {copied === "amount" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="raw">Raw Amount (Smallest Unit)</Label>
            <div className="flex gap-2">
              <Input
                id="raw"
                placeholder="1500000000000000000"
                value={rawAmount}
                onChange={(e) => handleRawAmountChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(rawAmount, "raw")}
                disabled={!rawAmount}
              >
                {copied === "raw" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
