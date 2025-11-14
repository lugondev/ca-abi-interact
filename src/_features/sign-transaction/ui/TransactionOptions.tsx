import { TAbiFunction, TContract } from "@entities/contract";
import { useState } from "react";
import { FunctionInputs } from "@entities/contract/ui/FunctionInputs";
import { SignTransaction } from "./SignTransaction";
import { SignOnly } from "./SignOnly";
import { Button } from "@/components/ui/button";
import { Pen, FileSignature } from "lucide-react";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
};

type ActionMode = "write" | "signonly" | null;

export const TransactionOptions = ({ contract, abiItem }: TProps) => {
  const [args, setArgs] = useState<string[] | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [formUpdate, setFormUpdate] = useState(0);

  const createTransaction = (values: string[]) => {
    setArgs(values);
    setFormUpdate((state) => state + 1);
  };

  const handleActionSelect = (mode: ActionMode) => {
    setActionMode(mode);
  };

  return (
    <div className="space-y-4">
      <div>
        <FunctionInputs
          abiItem={abiItem}
          onSubmit={createTransaction}
          buttonText="Create transaction"
        />
      </div>

      {args && (
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleActionSelect("write")}
              variant={actionMode === "write" ? "default" : "outline"}
              className="flex-1"
            >
              <Pen className="h-4 w-4 mr-2" />
              Write (Sign & Broadcast)
            </Button>
            <Button
              onClick={() => handleActionSelect("signonly")}
              variant={actionMode === "signonly" ? "default" : "outline"}
              className="flex-1"
            >
              <FileSignature className="h-4 w-4 mr-2" />
              Sign Only
            </Button>
          </div>

          {/* Action Forms */}
          {actionMode === "write" && (
            <div className="border rounded-lg p-4">
              <SignTransaction
                key={`write-${formUpdate}`}
                contract={contract}
                abiItem={abiItem}
                args={args}
              />
            </div>
          )}

          {actionMode === "signonly" && (
            <div className="border rounded-lg p-4">
              <SignOnly
                key={`signonly-${formUpdate}`}
                contract={contract}
                abiItem={abiItem}
                args={args}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
