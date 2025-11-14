import { BooleanValue } from "@shared/ui/BooleanValue";
import { TAbiParamType } from "../model/types";
import { AddressValue } from "@shared/ui/AddressValue";
import { ValueDisplay } from "@shared/ui/ValueDisplay";
import { JsonDisplay } from "@shared/ui/JsonDisplay";
import { TAddress, TChainId } from "@shared/lib/web3";

type TProps = {
  abiType: TAbiParamType;
  value: unknown;
  chain?: TChainId;
  shorten?: boolean;
  explorerUrl?: string;
};

// Custom JSON replacer to handle BigInt
const bigIntReplacer = (key: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

export const ParamValue = ({ abiType, value, chain, shorten = true, explorerUrl }: TProps) => {
  if (abiType === "bool") {
    return <BooleanValue value={String(value)} />;
  }

  if (abiType === "address") {
    const addressValue = value as TAddress;
    return <AddressValue value={addressValue} explorerUrl={explorerUrl} shorten={shorten} />;
  }

  // Handle tuple/struct (object or array)
  if (typeof value === "object" && value !== null) {
    const jsonString = JSON.stringify(value, bigIntReplacer, 2);
    return <JsonDisplay value={jsonString} />;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const jsonString = JSON.stringify(value, bigIntReplacer, 2);
    return <JsonDisplay value={jsonString} />;
  }

  const stringValue = String(value);

  // For long values, use ValueDisplay with copy functionality
  if (stringValue.length > 50 || abiType.includes("uint") || abiType.includes("bytes")) {
    return <ValueDisplay value={stringValue} />;
  }

  return <span className="text-sm break-all">{stringValue}</span>;
};
