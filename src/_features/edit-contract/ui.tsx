import { useCallback, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContractForm,
  TContract,
  TContractWithoutId,
} from "@entities/contract";
import { useEditContact } from "./model";

type TProps = {
  contract: TContract;
};

export const EditContractButton = ({ contract }: TProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const editContract = useEditContact(contract);

  const showModal = () => setFormVisible(true);
  const hideModal = () => setFormVisible(false);

  const onSubmit = useCallback(
    (values: TContractWithoutId) => {
      hideModal();
      editContract(values);
    },
    [editContract]
  );

  return (
    <Dialog open={formVisible} onOpenChange={setFormVisible}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={showModal}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit contract</DialogTitle>
        </DialogHeader>
        <ContractForm
          value={contract}
          buttonText="Update"
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
