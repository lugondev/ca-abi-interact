"use client";

import { useState, useEffect } from "react";
import { TAbiItem, TAbiParam } from "@entities/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { FlexVertical } from "@shared/ui/Grid";

type TProps = {
  type: "function" | "event" | "constructor";
  onSubmit: (item: TAbiItem) => void;
  onCancel?: () => void;
  initialItem?: TAbiItem;
};

// Helper functions to initialize state from initialItem
const getInitialName = (initialItem?: TAbiItem): string => {
  if (!initialItem) return "";
  if (initialItem.type === "function" || initialItem.type === "event") {
    return initialItem.name || "";
  }
  return "";
};

const getInitialStateMutability = (
  initialItem?: TAbiItem
): "pure" | "view" | "nonpayable" | "payable" => {
  if (!initialItem) return "nonpayable";
  if (initialItem.type === "function" || initialItem.type === "constructor") {
    return initialItem.stateMutability || "nonpayable";
  }
  return "nonpayable";
};

const getInitialInputs = (
  initialItem?: TAbiItem,
  type?: string
): TAbiParam[] => {
  if (!initialItem) return [];
  if (
    initialItem.type === "function" ||
    initialItem.type === "event" ||
    initialItem.type === "constructor"
  ) {
    return (
      initialItem.inputs?.map((input) => {
        const result = { ...(input as any) } as TAbiParam & {
          indexed?: boolean;
        };
        if (type === "event" && initialItem.type === "event") {
          result.indexed =
            ("indexed" in input ? (input as any).indexed : false) || false;
        }
        return result;
      }) || []
    );
  }
  return [];
};

const getInitialOutputs = (initialItem?: TAbiItem): TAbiParam[] => {
  if (!initialItem) return [];
  if (initialItem.type === "function" && initialItem.outputs) {
    return [...initialItem.outputs];
  }
  return [];
};

const getInitialAnonymous = (initialItem?: TAbiItem): boolean => {
  if (!initialItem) return false;
  if (initialItem.type === "event") {
    return initialItem.anonymous || false;
  }
  return false;
};

export const AbiItemForm = ({
  type,
  onSubmit,
  onCancel,
  initialItem,
}: TProps) => {
  const [name, setName] = useState(() => getInitialName(initialItem));
  const [stateMutability, setStateMutability] = useState<
    "pure" | "view" | "nonpayable" | "payable"
  >(() => getInitialStateMutability(initialItem));
  const [inputs, setInputs] = useState<TAbiParam[]>(() =>
    getInitialInputs(initialItem, type)
  );
  const [outputs, setOutputs] = useState<TAbiParam[]>(() =>
    getInitialOutputs(initialItem)
  );
  const [anonymous, setAnonymous] = useState(() =>
    getInitialAnonymous(initialItem)
  );

  // Reset form when initialItem changes
  useEffect(() => {
    setName(getInitialName(initialItem));
    setStateMutability(getInitialStateMutability(initialItem));
    setInputs(getInitialInputs(initialItem, type));
    setOutputs(getInitialOutputs(initialItem));
    setAnonymous(getInitialAnonymous(initialItem));
  }, [initialItem, type]);

  const addInput = () => {
    const newInput: TAbiParam = { name: "", type: "uint256" } as TAbiParam;
    if (type === "event") {
      (newInput as any).indexed = false;
    }
    setInputs([...inputs, newInput]);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const updateInput = (
    index: number,
    field: keyof TAbiParam | "indexed",
    value: string | boolean
  ) => {
    setInputs(
      inputs.map((input, i) =>
        i === index ? ({ ...input, [field]: value } as TAbiParam) : input
      )
    );
  };

  const addOutput = () => {
    setOutputs([...outputs, { name: "", type: "uint256" }]);
  };

  const removeOutput = (index: number) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const updateOutput = (
    index: number,
    field: keyof TAbiParam,
    value: string | boolean
  ) => {
    setOutputs(
      outputs.map((output, i) =>
        i === index ? { ...output, [field]: value } : output
      )
    );
  };

  const handleSubmit = () => {
    if (type === "function") {
      if (!name.trim()) {
        alert("Function name is required");
        return;
      }
      const item: TAbiItem = {
        type: "function",
        name,
        inputs: inputs.filter((i) => i.type.trim()),
        outputs: outputs.filter((o) => o.type.trim()),
        stateMutability,
      };
      onSubmit(item);
      resetForm();
    } else if (type === "event") {
      if (!name.trim()) {
        alert("Event name is required");
        return;
      }
      const item: TAbiItem = {
        type: "event",
        name,
        inputs: inputs
          .filter((i) => i.type.trim())
          .map((input) => ({
            ...(input as any),
            indexed:
              ("indexed" in input ? (input as any).indexed : false) || false,
          })),
        anonymous,
      };
      onSubmit(item);
      resetForm();
    } else if (type === "constructor") {
      const item: TAbiItem = {
        type: "constructor",
        inputs: inputs.filter((i) => i.type.trim()),
        // Constructors only accept 'payable' or 'nonpayable' in ABI; coerce to a valid value
        stateMutability: (stateMutability === "payable"
          ? "payable"
          : "nonpayable") as any,
      };
      onSubmit(item);
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setStateMutability("nonpayable");
    setInputs([]);
    setOutputs([]);
    setAnonymous(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">
          {type === "constructor" ? "Constructor" : `Add ${type}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FlexVertical size="medium">
          {type !== "constructor" && (
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === "function" ? "myFunction" : "MyEvent"}
              />
            </div>
          )}

          {type !== "event" && (
            <div>
              <Label htmlFor="stateMutability">State Mutability</Label>
              <Select
                value={stateMutability}
                onValueChange={(
                  value: "pure" | "view" | "nonpayable" | "payable"
                ) => setStateMutability(value)}
              >
                <SelectTrigger id="stateMutability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pure">pure</SelectItem>
                  <SelectItem value="view">view</SelectItem>
                  <SelectItem value="nonpayable">nonpayable</SelectItem>
                  <SelectItem value="payable">payable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "event" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="anonymous">Anonymous</Label>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Inputs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInput}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Input
              </Button>
            </div>
            <FlexVertical size="small">
              {inputs.map((input, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label>Name</Label>
                    <Input
                      value={input.name || ""}
                      onChange={(e) =>
                        updateInput(index, "name", e.target.value)
                      }
                      placeholder="paramName"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Type *</Label>
                    <Input
                      value={input.type}
                      onChange={(e) =>
                        updateInput(index, "type", e.target.value)
                      }
                      placeholder="uint256"
                      required
                    />
                  </div>
                  {type === "event" && (
                    <div className="flex items-center gap-2 pb-2">
                      <input
                        type="checkbox"
                        id={`indexed-${index}`}
                        checked={
                          ("indexed" in input
                            ? (input as any).indexed
                            : false) || false
                        }
                        onChange={(e) =>
                          updateInput(index, "indexed", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`indexed-${index}`}>Indexed</Label>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInput(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {inputs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No inputs. Click "Add Input" to add one.
                </p>
              )}
            </FlexVertical>
          </div>

          {type === "function" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Outputs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOutput}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Output
                </Button>
              </div>
              <FlexVertical size="small">
                {outputs.map((output, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Name</Label>
                      <Input
                        value={output.name || ""}
                        onChange={(e) =>
                          updateOutput(index, "name", e.target.value)
                        }
                        placeholder="returnName"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Type *</Label>
                      <Input
                        value={output.type}
                        onChange={(e) =>
                          updateOutput(index, "type", e.target.value)
                        }
                        placeholder="uint256"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOutput(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </FlexVertical>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {initialItem ? "Update" : "Add"}
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </FlexVertical>
      </CardContent>
    </Card>
  );
};
