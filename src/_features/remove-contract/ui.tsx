import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { TContract } from "@entities/contract";
import { useRemoveContract } from "./model";

type TProps = {
  contract: TContract;
};

export const RemoveContractButton = ({ contract }: TProps) => {
  const [open, setOpen] = useState(false);
  const remove = useRemoveContract(contract);

  const onConfirm = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();
      remove();
      setOpen(false);
    },
    [remove]
  );

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="h-6 w-6 p-0 relative z-10"
        title="Delete contract"
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove contract</AlertDialogTitle>
            <AlertDialogDescription>
              Really delete contract - {contract.name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              No
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
