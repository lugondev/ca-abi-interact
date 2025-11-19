"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function BaseConverter() {
  const [decimal, setDecimal] = useState<string>("");
  const [hex, setHex] = useState<string>("");
  const [binary, setBinary] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    if (!value) {
      setHex("");
      setBinary("");
      return;
    }
    try {
      const val = BigInt(value);
      setHex(val.toString(16));
      setBinary(val.toString(2));
    } catch (e) {
      // Ignore
    }
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    if (!value) {
      setDecimal("");
      setBinary("");
      return;
    }
    try {
      // Handle 0x prefix
      const cleanHex = value.startsWith("0x") ? value.slice(2) : value;
      const val = BigInt("0x" + cleanHex);
      setDecimal(val.toString());
      setBinary(val.toString(2));
    } catch (e) {
      // Ignore
    }
  };

  const handleBinaryChange = (value: string) => {
    setBinary(value);
    if (!value) {
      setDecimal("");
      setHex("");
      return;
    }
    try {
      const val = BigInt("0b" + value);
      setDecimal(val.toString());
      setHex(val.toString(16));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Base Converter</CardTitle>
          <CardDescription>
            Convert between Decimal, Hexadecimal, and Binary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="decimal">Decimal</Label>
            <div className="flex gap-2">
              <Input
                id="decimal"
                placeholder="255"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(decimal, "decimal")}
                disabled={!decimal}
              >
                {copied === "decimal" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hex">Hexadecimal</Label>
            <div className="flex gap-2">
              <Input
                id="hex"
                placeholder="ff"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(hex, "hex")}
                disabled={!hex}
              >
                {copied === "hex" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="binary">Binary</Label>
            <div className="flex gap-2">
              <Input
                id="binary"
                placeholder="11111111"
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(binary, "binary")}
                disabled={!binary}
              >
                {copied === "binary" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
