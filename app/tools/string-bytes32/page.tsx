"use client";

import { useState } from "react";
import { toHex, fromHex, stringToHex, hexToString, pad } from "viem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function StringBytes32Converter() {
  const [text, setText] = useState<string>("");
  const [bytes32, setBytes32] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (!value) {
      setBytes32("");
      return;
    }
    try {
      // Convert string to hex
      const hex = stringToHex(value);
      // Pad to bytes32 if needed, but usually bytes32 is fixed length.
      // If string is short, pad right.
      // viem's pad pads left by default, we might want right padding for strings in bytes32?
      // Actually, solidity bytes32 "string" is usually right padded.
      // But let's just show the hex representation first.
      
      // If the user wants "Bytes32" specifically, it implies a fixed size 32 byte array.
      // If the string is longer than 32 bytes, it won't fit.
      
      if (new TextEncoder().encode(value).length > 32) {
        setBytes32("String too long for bytes32");
        return;
      }

      // Manual right padding
      let result = hex;
      if (result.length < 66) {
        result = result + "0".repeat(66 - result.length);
      }
      setBytes32(result);
    } catch (e) {
      // Ignore
    }
  };

  const handleBytes32Change = (value: string) => {
    setBytes32(value);
    if (!value) {
      setText("");
      return;
    }
    try {
      const val = value.startsWith("0x") ? value : `0x${value}`;
      // Trim trailing zeros for string conversion
      const str = hexToString(val as `0x${string}`, { size: 32 });
      // Remove null characters if any
      setText(str.replace(/\0/g, ''));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>String Bytes32 Converter</CardTitle>
          <CardDescription>
            Convert strings to bytes32 and vice versa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">String</Label>
            <div className="flex gap-2">
              <Input
                id="text"
                placeholder="hello"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(text, "text")}
                disabled={!text}
              >
                {copied === "text" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bytes32">Bytes32</Label>
            <div className="flex gap-2">
              <Input
                id="bytes32"
                placeholder="0x68656c6c6f000000000000000000000000000000000000000000000000000000"
                value={bytes32}
                onChange={(e) => handleBytes32Change(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(bytes32, "bytes32")}
                disabled={!bytes32}
              >
                {copied === "bytes32" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
