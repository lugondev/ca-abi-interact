import { TContract, contractModel } from "@entities/contract";
import { GetterCall } from "@features/execute-contract";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TProps = {
  contract: TContract;
};

export const CallsList = ({ contract }: TProps) => {
  const functions = contractModel.useContractParamCalls(contract);

  if (functions.length === 0) {
    return <div className="text-center text-muted-foreground py-4 text-sm">No calls available</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {functions.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.name}</AccordionTrigger>
          <AccordionContent>
            <GetterCall contract={contract} abiItem={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
