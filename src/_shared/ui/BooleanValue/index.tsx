import { Check, X } from "lucide-react";

export const BooleanValue = ({ value }: { value: boolean | string }) => {
  return value === true || value === "true" || value === "1" ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <X className="h-4 w-4 text-red-600" />
  );
};

