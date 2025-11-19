"use client";

import { useState } from "react";
import { decodeFunctionData, parseAbiItem, getAbiItem, toHex, AbiFunction } from "viem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type DecodedArg = {
  name: string;
  type: string;
  value: any;
  baseType: string;
};

export default function CalldataDecoder() {
  const [calldata, setCalldata] = useState<string>("");
  const [abi, setAbi] = useState<string>("");
  const [decodedResult, setDecodedResult] = useState<{
    functionName: string;
    args: DecodedArg[];
    signatureHash?: string;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleDecode = () => {
    setError("");
    setDecodedResult(null);

    if (!calldata) {
      setError("Please enter calldata");
      return;
    }

    if (!abi) {
      setError("Please enter ABI (JSON or human-readable signature)");
      return;
    }

    try {
      let abiItems: any[] = [];
      // Try to parse as JSON first
      try {
        const jsonAbi = JSON.parse(abi);
        if (Array.isArray(jsonAbi)) {
           abiItems = jsonAbi;
        } else {
           abiItems = [jsonAbi];
        }
      } catch {
        // If not JSON, try human readable
        // Split by newline to handle multiple signatures if needed, though usually one is enough
        abiItems = [parseAbiItem(abi)];
      }

      const result = decodeFunctionData({
        abi: abiItems,
        data: calldata as `0x${string}`,
      });

      // Find the matching ABI item to get argument names
      const abiItem = getAbiItem({
        abi: abiItems,
        name: result.functionName,
        args: result.args,
      }) as AbiFunction;

      const decodedArgs: DecodedArg[] = [];
      
      if (abiItem && abiItem.inputs && result.args) {
        abiItem.inputs.forEach((input, index) => {
          const value = (result.args as any[])[index];
          decodedArgs.push({
            name: input.name || `arg${index}`,
            type: input.type,
            baseType: input.type, // simplified for now
            value: value,
          });
        });
      }

      setDecodedResult({
        functionName: result.functionName,
        args: decodedArgs,
        signatureHash: calldata.slice(0, 10),
      });

    } catch (e: any) {
      setError(e.message || "Failed to decode");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatValue = (val: any, type: string): string => {
    if (typeof val === 'bigint') return val.toString();
    if (typeof val === 'object') return JSON.stringify(val, (k, v) => typeof v === 'bigint' ? v.toString() : v);
    return String(val);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Calldata Decoder</CardTitle>
          <CardDescription>
            Decode transaction calldata using ABI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="calldata">Calldata</Label>
            <Textarea
              id="calldata"
              placeholder="0x..."
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abi">ABI / Function Signature</Label>
            <Textarea
              id="abi"
              placeholder='[{"type":"function", ...}] or "function transfer(address to, uint256 amount)"'
              value={abi}
              onChange={(e) => setAbi(e.target.value)}
              className="font-mono h-32"
            />
          </div>
          <Button onClick={handleDecode}>Decode</Button>
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          {decodedResult && (
            <div className="mt-8 space-y-6 border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Signature hash</span>
                <div className="bg-muted px-3 py-1 rounded-md font-mono text-sm">
                  {decodedResult.signatureHash}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-500 font-semibold">function</span>
                <span className="font-bold text-lg">{decodedResult.functionName}</span>
              </div>

              <div className="space-y-4">
                {decodedResult.args.map((arg, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <span className="text-pink-500 font-medium">{arg.name}</span>
                      <span className="text-purple-400 text-sm">{arg.type}</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between gap-4 bg-background p-2 rounded border">
                      <span className="font-mono text-sm break-all">
                        {formatValue(arg.value, arg.type)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => copyToClipboard(formatValue(arg.value, arg.type), `arg-${idx}`)}
                      >
                        {copied === `arg-${idx}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
