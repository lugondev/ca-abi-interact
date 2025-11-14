import { TValueInput } from "@shared/lib/props";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TProps = TValueInput<boolean>;

export const BoolInput = ({ value, onChange }: TProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button
        type="button"
        variant={value === true ? "default" : "outline"}
        className={cn(
          "rounded-r-none",
          value === true && "bg-primary text-primary-foreground"
        )}
        onClick={() => onChange(true)}
      >
        True
      </Button>
      <Button
        type="button"
        variant={value === false ? "default" : "outline"}
        className={cn(
          "rounded-l-none border-l-0",
          value === false && "bg-primary text-primary-foreground"
        )}
        onClick={() => onChange(false)}
      >
        False
      </Button>
    </div>
  );
};

