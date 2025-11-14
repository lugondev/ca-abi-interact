import { TContract, contractModel } from "@entities/contract";
import { TransactionOptions } from "@features/sign-transaction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <AccordionTrigger>{item.name}</AccordionTrigger>
          <AccordionContent>
            <TransactionOptions contract={contract} abiItem={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
