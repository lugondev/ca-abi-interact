import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { download } from "@shared/lib/download";
import { TTransactionParams } from "@shared/lib/tx";

type TProps = {
  fetchTxFields: () => TTransactionParams;
};
export const DownloadTransaction = ({ fetchTxFields }: TProps) => {
  const handleClick = useCallback(() => {
    const tx = fetchTxFields();
    download(JSON.stringify(tx, null, "\t"), "tx.json");
  }, [fetchTxFields]);

  return (
    <Button variant="ghost" onClick={handleClick}>
      Download
    </Button>
  );
};
