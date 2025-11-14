import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { TChainId } from "@shared/lib/web3";
import { TValueInput } from "@shared/lib/props";
import { useChainListSafe } from "../model/useChainList";
import { useMemo } from "react";

type TProps = TValueInput<TChainId> & {};

export const ChainSelect = ({ value, onChange }: TProps) => {
  const list = useChainListSafe();

  const chainOptions: ComboboxOption[] = useMemo(() => {
    return list.map((item) => ({
      value: String(item.chainId),
      label: `${item.name} (${item.chainId})`,
    }));
  }, [list]);

  return (
    <Combobox
      options={chainOptions}
      value={String(value)}
      onValueChange={(val) => onChange(Number(val) as TChainId)}
      placeholder="Select a chain..."
      searchPlaceholder="Search chains..."
      emptyText="No chain found."
      className="w-full"
    />
  );
};

