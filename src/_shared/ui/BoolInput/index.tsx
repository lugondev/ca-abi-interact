import { TValueInput } from "@shared/lib/props";
import { Switch } from "@/components/ui/switch";

type TProps = TValueInput<boolean>;

export const BoolInput = ({ value, onChange }: TProps) => {
  return (
    <Switch
      checked={value}
      onCheckedChange={onChange}
    />
  );
};

