import { useState } from "react";
import { formatUnits } from "viem";
import { ValueDisplay } from "../ValueDisplay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export enum UnitMode {
  WEI = 0,
  GWEI = 9,
  ETH = 18,
}

type TProps = {
  value: string | bigint | number;
  className?: string;
  copyable?: boolean;
};

const unitOptions = [
  { value: UnitMode.WEI, label: "wei" },
  { value: UnitMode.GWEI, label: "gwei" },
  { value: UnitMode.ETH, label: "eth" },
];

export const Uint256ValueDisplay = ({ value, className, copyable = true }: TProps) => {
  const [mode, setMode] = useState<UnitMode>(UnitMode.WEI);

  // Convert value to BigInt for calculations
  // Handle various input types: bigint, number, string
  let bigIntValue: bigint;
  try {
    if (typeof value === "bigint") {
      bigIntValue = value;
    } else if (typeof value === "number") {
      bigIntValue = BigInt(Math.floor(value));
    } else {
      // String value - remove any non-numeric characters except minus sign
      const cleanValue = String(value).trim();
      bigIntValue = BigInt(cleanValue);
    }
  } catch (error) {
    // If conversion fails, fallback to displaying as string
    return <ValueDisplay value={String(value)} className={className} copyable={copyable} />;
  }

  // Format value based on selected mode
  const formattedValue = formatUnits(bigIntValue, mode);

  return (
    <div className="flex items-start gap-2 w-full min-w-0">
      <div className="flex-1 min-w-0">
        <ValueDisplay value={formattedValue} className={className} copyable={copyable} />
      </div>
      <Select
        value={String(mode)}
        onValueChange={(val) => setMode(Number(val) as UnitMode)}
      >
        <SelectTrigger className="w-20 flex-shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {unitOptions.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

