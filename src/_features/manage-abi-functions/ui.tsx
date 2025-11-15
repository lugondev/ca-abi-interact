import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { TContract, TAbiItem, contractModel } from "@entities/contract";
import { useManageAbiFunctions } from "./model";

type TProps = {
  contract: TContract;
};

const getAbiItemTypeLabel = (item: TAbiItem): string => {
  if (item.type === "function") {
    return item.stateMutability || "nonpayable";
  }
  return item.type;
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

const getAbiItemDisplayName = (item: TAbiItem): string => {
  if (item.type === "function" || item.type === "event") {
    return item.name || "(unnamed)";
  }
  return item.type;
};

type DeleteButtonProps = {
  item: TAbiItem;
  index: number;
  onDelete: (index: number) => void;
};

const DeleteButton = ({ item, index, onDelete }: DeleteButtonProps) => {
  const signature = getAbiItemSignature(item);

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
            onClick={() => onDelete(index)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ManageAbiFunctions = ({ contract: initialContract }: TProps) => {
  // Get the latest contract from store to ensure we have updated data
  const { contracts } = contractModel.useContracts();
  const contract = useMemo(
    () => contracts.find((c) => c.id === initialContract.id) || initialContract,
    [contracts, initialContract.id]
  );

  const { addAbiItem, removeAbiItem } = useManageAbiFunctions(contract);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAbiItemJson, setNewAbiItemJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    try {
      const parsed = JSON.parse(newAbiItemJson);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => addAbiItem(item));
      } else {
        addAbiItem(parsed);
      }
      setNewAbiItemJson("");
      setAddDialogOpen(false);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">ABI Functions</h3>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Function
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add ABI Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ABI Item JSON</Label>
                <Textarea
                  value={newAbiItemJson}
                  onChange={(e) => {
                    setNewAbiItemJson(e.target.value);
                    setError(null);
                  }}
                  placeholder='{"type": "function", "name": "myFunction", "inputs": [], "outputs": [], "stateMutability": "view"}'
                  rows={8}
                  className="font-mono text-xs"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">
                  You can add a single item or an array of items
                </p>
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[60%]">Signature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contract.abi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No ABI items. Add your first function above.
                </TableCell>
              </TableRow>
            ) : (
              contract.abi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant="outline">{getAbiItemTypeLabel(item)}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{getAbiItemDisplayName(item)}</span>
                      <DeleteButton item={item} index={index} onDelete={removeAbiItem} />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {getAbiItemSignature(item)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

