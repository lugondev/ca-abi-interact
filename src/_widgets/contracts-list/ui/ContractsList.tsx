import { AddContractButton } from "@features/add-contract";
import { RemoveContractButton } from "@features/remove-contract";
import { EditContractButton } from "@features/edit-contract";
import { DuplicateContractButton } from "@features/duplicate-contract";
import { TContract, contractModel } from "@entities/contract";
import { useCurrentChainContracts } from "../model";
import { SmallCard } from "./SmallCard";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const EditButtons = ({ contract }: { contract: TContract }) => {
  return (
    <div className="flex gap-0.5">
      <DuplicateContractButton contract={contract} />
      <EditContractButton contract={contract} />
      <RemoveContractButton contract={contract} />
    </div>
  );
};

export const ContractsList = () => {
  const { currentId, setCurrent } = contractModel.useContracts();
  const contracts = useCurrentChainContracts();

  return (
    <div className="flex flex-col gap-2 p-3">
      <AddContractButton />

      <div className="space-y-1">
        {contracts.map((item) => (
          <Card
            key={item.id}
            className={cn("cursor-pointer transition-all hover:shadow-md", {
              "border-primary ring-2 ring-primary/20": currentId == item.id,
            })}
            onClick={() => setCurrent(item.id)}
          >
            <div className="p-2">
              <SmallCard
                contract={item}
                extra={<EditButtons contract={item} />}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
