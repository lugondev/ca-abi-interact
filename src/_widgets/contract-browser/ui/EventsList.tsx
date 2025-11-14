import { TContract, contractModel } from "@entities/contract";
import { FetchEvents } from "@features/fetch-events";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TProps = {
  contract: TContract;
};

export const EventsList = ({ contract }: TProps) => {
  const events = contractModel.useContractEvents(contract);

  if (events.length === 0) {
    return <div className="text-center text-muted-foreground py-4 text-sm">No events available</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {events.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.name}</AccordionTrigger>
          <AccordionContent>
            <FetchEvents contract={contract} event={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
