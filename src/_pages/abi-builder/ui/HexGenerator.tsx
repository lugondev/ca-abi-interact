"use client";

import { useState, useMemo, useEffect } from "react";
import { TAbiItem, TAbiFunction, TAbiConstructor } from "@entities/contract";
import { contractUtils } from "@entities/contract";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FlexVertical } from "@shared/ui/Grid";
import { ParamInput } from "@entities/contract/ui/ParamInput";
import { encodeFunctionData, encodeDeployData, isHex } from "viem";
import { Copy, Check } from "lucide-react";
import { getDefaultValue } from "@entities/contract/lib";

type TProps = {
  abiItems: TAbiItem[];
};

export const HexGenerator = ({ abiItems }: TProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [bytecode, setBytecode] = useState<string>("");
  const [values, setValues] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);

  const selectedItem = selectedItemIndex !== null ? abiItems[selectedItemIndex] : null;
  const isFunction = selectedItem?.type === "function";
  const isConstructor = selectedItem?.type === "constructor";

  // Get functions and constructors for selection with their original indices
  const availableItems = useMemo(() => {
    return abiItems
      .map((item, index) => ({ item, originalIndex: index }))
      .filter(
        ({ item }) => item.type === "function" || item.type === "constructor"
      ) as Array<{ item: TAbiFunction | TAbiConstructor; originalIndex: number }>;
  }, [abiItems]);

  // Initialize values when item changes
  useEffect(() => {
    if (selectedItem && (isFunction || isConstructor)) {
      const initialValues: Record<number, string> = {};
      selectedItem.inputs.forEach((input, index) => {
        const defaultValue = getDefaultValue(input.type);
        initialValues[index] = Array.isArray(defaultValue)
          ? JSON.stringify(defaultValue)
          : String(defaultValue);
      });
      setValues(initialValues);
    } else {
      setValues({});
    }
  }, [selectedItem, isFunction, isConstructor]);

  const handleValueChange = (index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: value }));
  };

  const encodedHex = useMemo(() => {
    if (!selectedItem || (!isFunction && !isConstructor)) {
      return "";
    }

    try {
      if (isFunction) {
        const parsedArgs = contractUtils.parseFunctionArgs(
          Object.values(values),
          selectedItem.inputs
        );
        return encodeFunctionData({
          abi: [selectedItem],
          functionName: selectedItem.name,
          args: parsedArgs,
        });
      } else if (isConstructor) {
        if (!bytecode || !isHex(bytecode)) {
          return "";
        }
        const parsedArgs = contractUtils.parseFunctionArgs(
          Object.values(values),
          selectedItem.inputs
        );
        return encodeDeployData({
          abi: [selectedItem],
          bytecode: bytecode as `0x${string}`,
          args: parsedArgs.length > 0 ? parsedArgs : undefined,
        });
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
    return "";
  }, [selectedItem, values, bytecode, isFunction, isConstructor]);

  const handleCopy = async () => {
    if (encodedHex && encodedHex.startsWith("0x")) {
      await navigator.clipboard.writeText(encodedHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getItemLabel = (item: TAbiFunction | TAbiConstructor, index: number): string => {
    if (item.type === "function") {
      const inputs = item.inputs.map((input) => input.type).join(", ");
      return `${item.name}(${inputs})`;
    } else {
      const inputs = item.inputs.map((input) => input.type).join(", ");
      return `constructor(${inputs})`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Hex Data</CardTitle>
        <CardDescription>
          Encode function calls or constructor data to hex format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FlexVertical size="medium">
          <div>
            <Label htmlFor="select-item">Select Function or Constructor</Label>
            <Select
              value={selectedItemIndex !== null ? String(selectedItemIndex) : undefined}
              onValueChange={(value) => {
                const index = value ? Number(value) : null;
                setSelectedItemIndex(index);
                setBytecode("");
              }}
              disabled={availableItems.length === 0}
            >
              <SelectTrigger id="select-item">
                <SelectValue placeholder={
                  availableItems.length > 0 
                    ? "Choose an item to encode" 
                    : "No functions or constructors available. Add functions or constructors to generate hex data."
                } />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map(({ item, originalIndex }) => (
                  <SelectItem key={originalIndex} value={String(originalIndex)}>
                    {item.type === "function" ? "Function" : "Constructor"}:{" "}
                    {getItemLabel(item, originalIndex)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isConstructor && (
            <div>
              <Label htmlFor="bytecode">Bytecode *</Label>
              <Textarea
                id="bytecode"
                rows={4}
                value={bytecode}
                onChange={(e) => setBytecode(e.target.value)}
                placeholder="0x6080604052348015600f57600080fd5b50..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for constructor encoding
              </p>
            </div>
          )}

          {selectedItem && (isFunction || isConstructor) && (
            <div>
              <Label>Parameters</Label>
              <div className="mt-2">
              <FlexVertical size="small">
                {selectedItem.inputs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No parameters required
                  </p>
                ) : (
                  selectedItem.inputs.map((input, index) => (
                    <div key={index} className="space-y-1.5">
                      <Label htmlFor={`param-${index}`} className="text-sm">
                        {input.name || `param${index}`} ({input.type})
                      </Label>
                      <ParamInput
                        value={values[index] || ""}
                        onChange={(value) => handleValueChange(index, value)}
                        abiParam={input}
                      />
                    </div>
                  ))
                )}
              </FlexVertical>
              </div>
            </div>
          )}

          {encodedHex && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Encoded Hex Data</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!encodedHex.startsWith("0x")}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                rows={6}
                value={encodedHex}
                readOnly
                className="font-mono text-sm"
              />
              {encodedHex.startsWith("0x") && (
                <p className="text-xs text-muted-foreground mt-1">
                  Length: {encodedHex.length} characters ({Math.ceil((encodedHex.length - 2) / 2)} bytes)
                </p>
              )}
            </div>
          )}
        </FlexVertical>
      </CardContent>
    </Card>
  );
};

