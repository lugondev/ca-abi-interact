import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TEventFilter } from "../model/types";
import { Minus, Plus } from "lucide-react";
import { ParamInput } from "@entities/contract";
import { FlexHorizontal, FlexVertical } from "@shared/ui/Grid";

type TProps = {
  name: string;
  filter: TEventFilter;
  enable: (_value: boolean) => void;
  add: () => void;
  remove: () => void;
  update: (_index: number, _value: string) => void;
};

export const EventFilterInput = ({
  name,
  filter,
  enable,
  add,
  remove,
  update,
}: TProps) => {
  return (
    <FlexVertical>
      <FlexHorizontal>
        <b>{`${name} (${filter.type})`}</b>
        <Switch onCheckedChange={enable} />
        <Button size="sm" onClick={add} disabled={!filter.active} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          disabled={filter.values.length <= 1 || !filter.active}
          onClick={remove}
          variant="outline"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </FlexHorizontal>
      <FlexVertical size="small">
        {filter.values.map((item, index) => (
          <ParamInput
            key={index}
            abiParam={filter.type}
            onChange={(value) => update(index, value)}
            value={item}
          />
        ))}
      </FlexVertical>
    </FlexVertical>
  );
};
