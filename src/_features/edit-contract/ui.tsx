import { useCallback, useState, useMemo } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ContractForm,
  TContract,
  TContractWithoutId,
  contractModel,
} from "@entities/contract";
import { useEditContact } from "./model";
import { ManageAbiFunctions } from "../manage-abi-functions";

type TProps = {
  contract: TContract;
};

export const EditContractButton = ({ contract: initialContract }: TProps) => {
  // Get the latest contract from store to ensure we have updated data
  const { contracts } = contractModel.useContracts();
  const contract = useMemo(
    () => contracts.find((c) => c.id === initialContract.id) || initialContract,
    [contracts, initialContract.id]
  );

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
        <Button
          size="sm"
          variant="ghost"
          onClick={showModal}
          className="h-6 w-6 p-0"
          title="Edit contract"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit contract</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="abi">ABI Functions</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <ContractForm
              value={contract}
              buttonText="Update"
              onSubmit={onSubmit}
            />
          </TabsContent>
          <TabsContent value="abi" className="mt-4">
            <ManageAbiFunctions contract={contract} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
