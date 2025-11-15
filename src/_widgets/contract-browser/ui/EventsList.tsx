import { TContract, contractModel, TAbiEvent } from "@entities/contract";
import { FetchEvents } from "@features/fetch-events";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DeleteAbiItemButton } from "@shared/ui/DeleteAbiItemButton";

type TProps = {
  contract: TContract;
};

export const EventsList = ({ contract }: TProps) => {
  const events = contractModel.useContractEvents(contract) as TAbiEvent[];

  if (events.length === 0) {
    return <div className="text-center text-muted-foreground py-4 text-sm">No events available</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {events.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <span>{item.name}</span>
              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                <DeleteAbiItemButton contract={contract} abiItem={item} />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <FetchEvents contract={contract} event={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
