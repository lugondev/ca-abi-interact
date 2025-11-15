import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TValueInput } from "@shared/lib/props";
import { AddressInput } from "@shared/ui/AddressInput";
import { TAddress } from "@shared/lib/web3";
import { BoolInput } from "@shared/ui/BoolInput";
import { AmountInput } from "@shared/ui/AmountInput";
import { TupleInput } from "./TupleInput";
import { getDefaultValue, getArrayItemType, isTupleType } from "../lib";
import { TAbiParamType, TAbiParam } from "../model/types";

type TProps = TValueInput<string> & {
  itemType: TAbiParamType;
  abiParam?: TAbiParam; // Full param object for tuple[] arrays
};

const parseArrayValue = (value: string): string[] => {
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    // If not valid JSON, try comma-separated format
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

const formatArrayValue = (arr: string[]): string => {
  return JSON.stringify(arr);
};

const ArrayItemInput = ({
  value,
  onChange,
  itemType,
  abiParam,
  index,
  onRemove,
  canRemove,
}: {
  value: string;
  onChange: (value: string) => void;
  itemType: TAbiParamType;
  abiParam?: TAbiParam;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) => {
  const renderInput = () => {
    // If it's a tuple type and we have the full param object, use TupleInput
    if (isTupleType(itemType) && abiParam) {
      return (
        <TupleInput
          value={value}
          onChange={onChange}
          abiParam={abiParam}
        />
      );
    }

    if (itemType === "address") {
      return (
        <AddressInput
          value={value as TAddress}
          onChange={onChange}
        />
      );
    }

    if (itemType === "bool") {
      return (
        <BoolInput
          value={value === "true" || value === "1"}
          onChange={(val) => onChange(val ? "1" : "0")}
        />
      );
    }

    if (itemType === "uint256") {
      return (
        <AmountInput
          value={String(value)}
          onChange={onChange}
        />
      );
    }

    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Item ${index + 1}`}
      />
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">{renderInput()}</div>
      {canRemove && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="shrink-0"
        >
          Remove
        </Button>
      )}
    </div>
  );
};

export const ArrayInput = ({ value, onChange, itemType, abiParam }: TProps) => {
  const [items, setItems] = useState<string[]>(() => {
    const parsed = parseArrayValue(value);
    return parsed.length > 0 ? parsed : [String(getDefaultValue(itemType))];
  });

  useEffect(() => {
    const parsed = parseArrayValue(value);
    if (parsed.length > 0) {
      setItems(parsed);
    }
  }, [value]);

  const handleItemChange = useCallback(
    (index: number, newValue: string) => {
      const newItems = [...items];
      newItems[index] = newValue;
      setItems(newItems);
      onChange(formatArrayValue(newItems));
    },
    [items, onChange]
  );

  const handleAdd = useCallback(() => {
    const defaultValue = getDefaultValue(itemType);
    const newItems = [...items, String(defaultValue)];
    setItems(newItems);
    onChange(formatArrayValue(newItems));
  }, [items, itemType, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      if (newItems.length === 0) {
        // Keep at least one item
        const defaultValue = getDefaultValue(itemType);
        newItems.push(String(defaultValue));
      }
      setItems(newItems);
      onChange(formatArrayValue(newItems));
    },
    [items, itemType, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {items.map((item, index) => (
          <ArrayItemInput
            key={index}
            value={item}
            onChange={(val) => handleItemChange(index, val)}
            itemType={itemType}
            abiParam={abiParam}
            index={index}
            onRemove={() => handleRemove(index)}
            canRemove={items.length > 1}
          />
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        + Add Item
      </Button>
    </div>
  );
};

