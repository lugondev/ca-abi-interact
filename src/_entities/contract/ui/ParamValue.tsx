import { BooleanValue } from "@shared/ui/BooleanValue";
import { TAbiParamType, TAbiParam } from "../model/types";
import { AddressValue } from "@shared/ui/AddressValue";
import { ValueDisplay } from "@shared/ui/ValueDisplay";
import { JsonDisplay } from "@shared/ui/JsonDisplay";
import { Uint256ValueDisplay } from "@shared/ui/Uint256ValueDisplay";
import { TAddress, TChainId } from "@shared/lib/web3";
import { TupleValue } from "./TupleValue";

type TProps = {
  abiType: TAbiParamType;
  value: unknown;
  chain?: TChainId;
  shorten?: boolean;
  explorerUrl?: string;
  abiParam?: TAbiParam; // Optional full parameter structure for tuple support
};

// Custom JSON replacer to handle BigInt
const bigIntReplacer = (key: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

export const ParamValue = ({ abiType, value, chain, shorten = true, explorerUrl, abiParam }: TProps) => {
  if (abiType === "bool") {
    return <BooleanValue value={String(value)} />;
  }

  if (abiType === "address") {
    const addressValue = value as TAddress;
    return <AddressValue value={addressValue} explorerUrl={explorerUrl} shorten={shorten} />;
  }

  // Check if this is a tuple type (including tuple[])
  const isTuple = abiType === "tuple" || abiType.startsWith("tuple");
  
  // Handle tuple/struct with named fields if abiParam is provided
  // This must be checked BEFORE checking if value is object/array to avoid fallback to JSON
  if (isTuple && abiParam) {
    const hasComponents = "components" in abiParam && abiParam.components && abiParam.components.length > 0;
    
    if (hasComponents) {
      // Check if value is actually a tuple (object or array)
      // Viem can return tuples as either objects (with named keys) or arrays (by index)
      // Arrays are also objects in JS, so we need to check both cases
      if (typeof value === "object" && value !== null) {
        // If it's a tuple with components, always use TupleValue to display with field names
        return (
          <TupleValue
            abiParam={abiParam}
            value={value}
            chain={chain}
            shorten={shorten}
            explorerUrl={explorerUrl}
          />
        );
      }
    }
  }

  // Handle tuple/struct (object or array) without named fields - fallback to JSON
  if (isTuple && (typeof value === "object" && value !== null || Array.isArray(value))) {
    const jsonString = JSON.stringify(value, bigIntReplacer, 2);
    return <JsonDisplay value={jsonString} />;
  }

  // Handle non-tuple objects
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const jsonString = JSON.stringify(value, bigIntReplacer, 2);
    return <JsonDisplay value={jsonString} />;
  }

  // Handle non-tuple arrays
  if (Array.isArray(value)) {
    const jsonString = JSON.stringify(value, bigIntReplacer, 2);
    return <JsonDisplay value={jsonString} />;
  }

  const stringValue = String(value);

  // Check if this is a uint256 type (or uint without size, which defaults to uint256)
  // Also support uint types that are 256 bits or larger
  const isUint256 = abiType === "uint256" || abiType === "uint" || 
    (abiType.startsWith("uint") && !abiType.includes("[") && 
     abiType.match(/^uint\d+$/) && parseInt(abiType.replace("uint", "")) === 256);

  // For uint256 values, use Uint256ValueDisplay with unit conversion
  if (isUint256) {
    return <Uint256ValueDisplay value={value as string | bigint | number} />;
  }

  // For long values, use ValueDisplay with copy functionality
  if (stringValue.length > 50 || abiType.includes("uint") || abiType.includes("bytes")) {
    return <ValueDisplay value={stringValue} />;
  }

  return <span className="text-sm break-all">{stringValue}</span>;
};
