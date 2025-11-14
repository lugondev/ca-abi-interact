import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContractForm, TContractWithoutId } from "@entities/contract";
import { useAddContact } from "./model";

export const AddContractButton = () => {
  const [formVisible, setFormVisible] = useState(false);
  const addContract = useAddContact();

  const showModal = () => setFormVisible(true);
  const hideModal = () => setFormVisible(false);

  const onSubmit = useCallback(
    (values: TContractWithoutId) => {
      hideModal();
      addContract(values);
    },
    [addContract]
  );

  return (
    <Dialog open={formVisible} onOpenChange={setFormVisible}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={showModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add contract
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new contract</DialogTitle>
        </DialogHeader>
        <ContractForm buttonText="Add" onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
