import { Check, X } from "lucide-react";

export const BooleanValue = ({ value }: { value: boolean | string }) => {
  return value === true || value === "true" ? (
    <Check className="h-4 w-4 text-green-600" title="true" />
  ) : (
    <X className="h-4 w-4 text-red-600" title="false" />
  );
};

