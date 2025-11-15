import { useCallback, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { TValueInput } from "@shared/lib/props";
import { TAbiParam } from "../model/types";
import { ParamInput } from "./ParamInput";

type TProps = TValueInput<string> & {
  abiParam: TAbiParam;
};

const parseTupleValue = (value: string, components: readonly TAbiParam[]): Record<number, string> => {
  if (!value.trim()) {
    const result: Record<number, string> = {};
    components.forEach((_, index) => {
      result[index] = "";
    });
    return result;
  }

  try {
    const parsed = JSON.parse(value);
    const result: Record<number, string> = {};
    
    if (Array.isArray(parsed)) {
      components.forEach((_, index) => {
        result[index] = parsed[index] !== undefined ? String(parsed[index]) : "";
      });
    } else if (typeof parsed === "object" && parsed !== null) {
      components.forEach((component, index) => {
        const fieldName = component.name || `field${index}`;
        const fieldValue = parsed[fieldName] ?? parsed[index] ?? parsed[String(index)];
        result[index] = fieldValue !== undefined ? String(fieldValue) : "";
      });
    } else {
      components.forEach((_, index) => {
        result[index] = "";
      });
    }
    
    return result;
  } catch {
    // If not valid JSON, return empty values
    const result: Record<number, string> = {};
    components.forEach((_, index) => {
      result[index] = "";
    });
    return result;
  }
};

const formatTupleValue = (values: Record<number, string>): string => {
  const arr = Object.keys(values)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => values[Number(key)]);
  return JSON.stringify(arr);
};

export const TupleInput = ({ value, onChange, abiParam }: TProps) => {
  const isTuple = abiParam.type === "tuple" || abiParam.type.startsWith("tuple");
  const hasComponents =
    "components" in abiParam && abiParam.components && abiParam.components.length > 0;

  if (!isTuple || !hasComponents) {
    // Fallback to regular input if not a tuple or no components
    return (
      <ParamInput
        value={value}
        onChange={onChange}
        abiParam={abiParam}
      />
    );
  }

  const components = abiParam.components;
  const [fieldValues, setFieldValues] = useState<Record<number, string>>(() =>
    parseTupleValue(value, components)
  );

  useEffect(() => {
    const parsed = parseTupleValue(value, components);
    setFieldValues(parsed);
  }, [value, components]);

  const handleFieldChange = useCallback(
    (index: number, fieldValue: string) => {
      const newValues = { ...fieldValues };
      newValues[index] = fieldValue;
      setFieldValues(newValues);
      onChange(formatTupleValue(newValues));
    },
    [fieldValues, onChange]
  );

  return (
    <div className="space-y-3 border-l-2 border-muted pl-4">
      {components.map((component, index) => {
        const fieldName = component.name || `field${index}`;
        return (
          <div key={index} className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {fieldName} ({component.type})
            </Label>
            <ParamInput
              value={fieldValues[index] || ""}
              onChange={(val) => handleFieldChange(index, val)}
              abiParam={component}
            />
          </div>
        );
      })}
    </div>
  );
};

