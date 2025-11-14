import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { TTransactionParams } from "@shared/lib/tx";
import { JsonDisplay } from "@shared/ui/JsonDisplay";
import { Eye } from "lucide-react";

type TProps = {
  fetchTxFields: () => TTransactionParams;
};

export const ViewTransaction = ({ fetchTxFields }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [txData, setTxData] = useState<TTransactionParams | null>(null);

  const handleClick = useCallback(() => {
    const tx = fetchTxFields();
    setTxData(tx);
    setIsOpen(true);
  }, [fetchTxFields]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={handleClick}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Data</DialogTitle>
        </DialogHeader>
        {txData && (
          <div className="mt-4">
            <JsonDisplay value={JSON.stringify(txData, null, 2)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
