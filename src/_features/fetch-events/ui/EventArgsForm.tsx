import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Col2, FlexVertical, Row } from "@shared/ui/Grid";
import { TAbiEvent } from "@entities/contract";
import { EventFilterInput } from "./EventFilterInput";
import { TEventQuery } from "../model/types";
import { useEventFilters } from "../model/useEventFilters";
import { useState } from "react";

type TProps = {
  event: TAbiEvent;
  loading?: boolean;
  onSubmit: (_values: TEventQuery) => void;
};

export const EventArgsForm = ({ event, loading, onSubmit }: TProps) => {
  const { filters, add, remove, update, enable } = useEventFilters(event);
  const [fromBlock, setFromBlock] = useState("");
  const [toBlock, setToBlock] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topics = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.active)
    );

    onSubmit({
      ...(fromBlock && { fromBlock: Number(fromBlock) }),
      ...(toBlock && { toBlock: Number(toBlock) }),
      topics,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FlexVertical size="medium">
        <Row>
          <Col2>
            <div className="space-y-1.5">
              <Label htmlFor="fromBlock" className="text-sm">From block</Label>
              <Input
                id="fromBlock"
                type="number"
                value={fromBlock}
                onChange={(e) => setFromBlock(e.target.value)}
                className="text-sm"
              />
            </div>
          </Col2>
          <Col2>
            <div className="space-y-1.5">
              <Label htmlFor="toBlock" className="text-sm">To block</Label>
              <Input
                id="toBlock"
                type="number"
                value={toBlock}
                onChange={(e) => setToBlock(e.target.value)}
                className="text-sm"
              />
            </div>
          </Col2>
        </Row>

        <Separator />
        <h3 className="text-sm font-medium">Filter by</h3>
        
        <Row>
          <Col2>
            <FlexVertical size="medium">
              {Object.entries(filters).map(([name, filter]) => (
                <EventFilterInput
                  key={name}
                  name={name}
                  filter={filter}
                  add={() => add(name)}
                  remove={() => remove(name)}
                  update={(index, value) => update(name, index, value)}
                  enable={(value) => enable(name, value)}
                />
              ))}
            </FlexVertical>
          </Col2>
        </Row>
        
        <Button type="submit" disabled={loading} className="text-sm">
          {loading ? "Loading..." : "Fetch"}
        </Button>
      </FlexVertical>
    </form>
  );
};
