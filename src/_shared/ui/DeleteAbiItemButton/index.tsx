import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { TAbiItem, TContract, contractModel } from "@entities/contract";
import { useManageAbiFunctions } from "@features/manage-abi-functions";

type TProps = {
  contract: TContract;
  abiItem: TAbiItem;
};

const getAbiItemSignature = (item: TAbiItem): string => {
  if (item.type === "function" || item.type === "event") {
    const inputs = item.inputs.map((input) => `${input.type} ${input.name || ""}`).join(", ");
    return `${item.name}(${inputs})`;
  }
  if (item.type === "constructor") {
    const inputs = item.inputs.map((input) => `${input.type} ${input.name || ""}`).join(", ");
    return `constructor(${inputs})`;
  }
  return item.type;
};

const findAbiItemIndex = (contract: TContract, targetItem: TAbiItem): number => {
  return contract.abi.findIndex((item) => {
    // Match by type and name
    if (item.type !== targetItem.type) return false;
    
    if ((item.type === "function" || item.type === "event") && 
        (targetItem.type === "function" || targetItem.type === "event")) {
      return item.name === targetItem.name;
    }
    
    if (item.type === "constructor" && targetItem.type === "constructor") {
      // For constructor, compare inputs
      if (item.inputs.length !== targetItem.inputs.length) return false;
      return item.inputs.every(
        (input, idx) => input.type === targetItem.inputs[idx]?.type
      );
    }
    
    return true;
  });
};

export const DeleteAbiItemButton = ({ contract: initialContract, abiItem }: TProps) => {
  // Get the latest contract from store to ensure we have updated data
  const { contracts } = contractModel.useContracts();
  const contract = useMemo(
    () => contracts.find((c) => c.id === initialContract.id) || initialContract,
    [contracts, initialContract.id]
  );

  const { removeAbiItem } = useManageAbiFunctions(contract);
  const signature = getAbiItemSignature(abiItem);

  const handleDelete = () => {
    const index = findAbiItemIndex(contract, abiItem);
    if (index !== -1) {
      removeAbiItem(index);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive h-6 w-6 p-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete ABI Item?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this ABI item?
            <br />
            <span className="font-mono text-xs mt-2 block p-2 bg-muted rounded">
              {signature}
            </span>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

