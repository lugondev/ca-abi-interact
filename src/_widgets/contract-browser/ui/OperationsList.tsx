import { TContract, contractModel } from "@entities/contract";
import { TransactionOptions } from "@features/sign-transaction";
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

export const OperationsList = ({ contract }: TProps) => {
  const functions = contractModel.useContractOperations(contract);

  if (functions.length === 0) {
    return <div className="text-center text-muted-foreground py-4 text-sm">No operations available</div>;
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
            <TransactionOptions contract={contract} abiItem={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
