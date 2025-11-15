import { TContract, contractModel, TAbiFunction } from "@entities/contract";
import { GetterCall } from "@features/execute-contract";
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

export const CallsList = ({ contract }: TProps) => {
  const functions = contractModel.useContractParamCalls(contract) as TAbiFunction[];

  if (functions.length === 0) {
    return <div className="text-center text-muted-foreground py-4 text-sm">No calls available</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {functions.map((item, index) => (
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
            <GetterCall contract={contract} abiItem={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
