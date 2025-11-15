import { Input } from "@/components/ui/input";
import { TValueInput } from "@shared/lib/props";
import { AddressInput } from "@shared/ui/AddressInput";
import { TAddress } from "@shared/lib/web3";
import { BoolInput } from "@shared/ui/BoolInput";
import { AmountInput } from "@shared/ui/AmountInput";
import { ArrayInput } from "./ArrayInput";
import { TupleInput } from "./TupleInput";
import { isArrayType, isTupleType, getArrayItemType } from "../lib";
import { TAbiParam } from "../model/types";

type TProps = TValueInput<string> & {
  abiParam: TAbiParam | TAbiParam["type"];
};

export const ParamInput = ({ value, onChange, abiParam }: TProps) => {
  // Handle case where abiParam is just a string type (for backward compatibility)
  const paramType = typeof abiParam === "string" ? abiParam : abiParam.type;
  const paramObject = typeof abiParam === "string" ? undefined : abiParam;

  // Check for array type first
  if (isArrayType(paramType)) {
    const itemType = getArrayItemType(paramType);
    // If it's tuple[] and we have the full param object, pass it to ArrayInput
    const tupleAbiParam = isTupleType(itemType) && paramObject ? paramObject : undefined;
    return (
      <ArrayInput
        value={value}
        onChange={onChange}
        itemType={itemType}
        abiParam={tupleAbiParam}
      />
    );
  }

  // Check for tuple type
  if (isTupleType(paramType) && paramObject) {
    return <TupleInput value={value} onChange={onChange} abiParam={paramObject} />;
  }

  // Handle basic types
  if (paramType === "address") {
    return <AddressInput value={value as TAddress} onChange={onChange} />;
  }

  if (paramType === "bool") {
    return (
      <BoolInput
        value={value === "1" || value === "true"}
        onChange={(value) => onChange(value ? "1" : "0")}
      />
    );
  }

  if (paramType === "uint256") {
    return <AmountInput value={String(value)} onChange={onChange} />;
  }

  return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
};
