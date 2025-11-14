import { Input } from "@/components/ui/input";
import { TValueInput, TWithClassname } from "@shared/lib/props";
import { TAddress } from "@shared/lib/web3";
import { AddressIcon } from "../AddressIcon";
import { cn } from "@/lib/utils";

type TProps = TWithClassname &
  TValueInput<TAddress> & {
    disabled?: boolean;
  };

export const AddressInput = ({
  value,
  onChange,
  className,
  disabled = false,
}: TProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AddressIcon address={value} size="small" />
      <Input
        maxLength={42}
        className="flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value as TAddress)}
        autoComplete="off"
        disabled={disabled}
      />
    </div>
  );
};

