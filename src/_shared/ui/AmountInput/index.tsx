import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { TValueInput } from "@shared/lib/props";

export enum Mode {
  WEI = 0,
  GWEI = 9,
  ETH = 18,
}

type TProps = TValueInput<string> & {
  disabled?: boolean;
  defaultMode?: Mode;
};

const options = [
  {
    value: Mode.WEI,
    label: "wei",
  },
  {
    value: Mode.GWEI,
    label: "gwei",
  },
  {
    value: Mode.ETH,
    label: "eth",
  },
];

const getValidationRegexp = (mode: number) => {
  if (mode === Mode.WEI) {
    //only integer numbers fow 'wei'
    return /^\d+$/;
  }

  if (mode === Mode.GWEI) {
    //limit to 9 decimals for 'gwei'
    return /^(\d+\.?\d{0,9}|\.\d{1,9})$/;
  }

  //limit to 18 decimals for 'ether'
  return /^(\d+\.?\d{0,18}|\.\d{1,18})$/;
};

const convertToWei = (mode: Mode, value: string) => {
  return String(parseUnits(value as `${number}`, mode));
};

const convertFromWei = (mode: Mode, value: string) => {
  return String(formatUnits(BigInt(value || "0"), mode));
};

export const AmountInput = ({
  value,
  disabled,
  onChange,
  defaultMode = Mode.WEI,
}: TProps) => {
  const [formatted, setFormatted] = useState(
    convertFromWei(defaultMode, value)
  );

  const [mode, setMode] = useState(defaultMode);

  const handleModeChange = (newMode: Mode) => {
    //convert stored value from old mode to new mode
    const weis = convertToWei(mode, formatted);
    const value = convertFromWei(newMode, weis);
    setMode(newMode);
    setFormatted(value);
  };

  const handleValueChange = (e: string) => {
    const reg = getValidationRegexp(mode);

    if ((!Number.isNaN(e) && reg.test(e)) || e === "") {
      setFormatted(e);

      onChange(convertToWei(mode, e || "0"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        disabled={disabled}
        value={formatted}
        onChange={(e) => handleValueChange(e.target.value)}
        className="flex-1"
      />
      <Select
        defaultValue={String(defaultMode)}
        onValueChange={(value) => handleModeChange(Number(value) as Mode)}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

