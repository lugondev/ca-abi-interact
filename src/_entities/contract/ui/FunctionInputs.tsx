import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { getDefaultValue } from "../lib";
import { TAbiConstructor, TAbiFunction } from "../model/types";
import { ParamInput } from "./ParamInput";

type TProps = {
  abiItem: TAbiFunction | TAbiConstructor;
  onSubmit: (_values: string[]) => void;
  buttonText: string;
};

export const FunctionInputs = ({ abiItem, onSubmit, buttonText }: TProps) => {
  const [values, setValues] = useState<Record<number, string>>(() => {
    const initialValues: Record<number, string> = {};
    abiItem.inputs.forEach((input, index) => {
      const defaultValue = getDefaultValue(input.type);
      initialValues[index] = Array.isArray(defaultValue) ? JSON.stringify(defaultValue) : String(defaultValue);
    });
    return initialValues;
  });

  const handleChange = useCallback((index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const argsLength = abiItem.inputs.length;
      const result = [...Array(argsLength).keys()].map(
        (key) => values[key] || ""
      );
      onSubmit(result);
    },
    [values, onSubmit, abiItem.inputs.length]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {abiItem.inputs.map((input, index) => (
        <div key={index} className="space-y-1.5">
          <Label htmlFor={`input-${index}`} className="text-sm">
            {input.name} ({input.type})
          </Label>
          <ParamInput
            value={values[index] || ""}
            onChange={(value) => handleChange(index, value)}
            abiParam={input}
          />
        </div>
      ))}

      <Button type="submit" className="text-sm">{buttonText}</Button>
    </form>
  );
};
