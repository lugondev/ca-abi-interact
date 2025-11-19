import { useCallback, useState, useMemo } from "react";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ContractForm,
  TContract,
  TContractWithoutId,
  contractModel,
} from "@entities/contract";
import { useDuplicateContract } from "./model";
import { ManageAbiFunctionsLocal } from "./ManageAbiFunctionsLocal";

type TProps = {
  contract: TContract;
};

export const DuplicateContractButton = ({
  contract: initialContract,
}: TProps) => {
  // Get the latest contract from store to ensure we have updated data
  const { contracts } = contractModel.useContracts();
  const contract = useMemo(
    () => contracts.find((c) => c.id === initialContract.id) || initialContract,
    [contracts, initialContract.id]
  );

  const [formVisible, setFormVisible] = useState(false);
  const [localAbi, setLocalAbi] = useState<TContract["abi"]>([]);
  const [initialAbi, setInitialAbi] = useState<TContract["abi"]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const duplicateContract = useDuplicateContract(contract);

  const showModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Reset submitting state and initialize local ABI
    setIsSubmitting(false);
    const abiCopy = [...contract.abi];
    setInitialAbi(abiCopy);
    setLocalAbi(abiCopy);
    setFormVisible(true);
  };

  const hideModal = useCallback(() => {
    setFormVisible(false);
  }, []);

  // Create initial value for the form
  const initialValue: TContractWithoutId = useMemo(
    () => ({
      chain: contract.chain,
      address: contract.address,
      name: `Copy of ${contract.name}`,
      abi: localAbi.length > 0 ? localAbi : [...contract.abi],
    }),
    [contract, localAbi]
  );

  // Create a virtual contract object for ManageAbiFunctionsLocal
  const virtualContract: TContract = useMemo(
    () => ({
      id: "temp" as any,
      chain: contract.chain,
      address: contract.address,
      name: `Copy of ${contract.name}`,
      abi: localAbi,
    }),
    [contract, localAbi]
  );

  const onSubmit = useCallback(
    (values: TContractWithoutId) => {
      // Prevent double submission
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      // Determine which ABI to use:
      // - If localAbi was modified in ABI tab (differs from initial), use localAbi
      // - Otherwise, use the ABI from the form (which may have been edited in General tab)
      const abiWasEditedInAbiTab =
        JSON.stringify(localAbi) !== JSON.stringify(initialAbi);

      const finalAbi = abiWasEditedInAbiTab ? localAbi : values.abi;

      // Create the duplicate contract (only once)
      duplicateContract({
        chain: values.chain,
        address: values.address,
        name: values.name,
        abi: finalAbi,
      });

      // Close modal after creating contract
      setFormVisible(false);
      setIsSubmitting(false);
    },
    [duplicateContract, localAbi, initialAbi, isSubmitting]
  );

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={showModal}
        className="h-6 w-6 p-0 relative z-10"
        title="Duplicate contract"
      >
        <Files className="h-3 w-3" />
      </Button>
      <Dialog
        open={formVisible}
        onOpenChange={(open) => {
          if (!open) {
            hideModal();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Duplicate contract</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="abi">ABI Functions</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <ContractForm
                value={initialValue}
                buttonText="Duplicate"
                onSubmit={onSubmit}
              />
            </TabsContent>
            <TabsContent value="abi" className="mt-4">
              <ManageAbiFunctionsLocal
                contract={virtualContract}
                onAbiChange={setLocalAbi}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
