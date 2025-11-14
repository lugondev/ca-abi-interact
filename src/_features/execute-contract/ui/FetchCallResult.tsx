import { ParamValue, TAbiFunction, TContract } from "@entities/contract";
import { chainModel } from "@entities/chain";
import { useContractCall } from "../model";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
  args: string[];
};
export const FetchCallResult = ({ contract, abiItem, args }: TProps) => {
  const { data, error, loading } = useContractCall(contract, abiItem, args);
  const { getAddressUrl } = chainModel.useChainExplorer(contract.chain);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const outputType = abiItem.outputs[0].type;
  const explorerUrl = outputType === "address" ? getAddressUrl(data as any) : undefined;

  return (
    <ParamValue 
      value={data} 
      abiType={outputType} 
      chain={contract.chain}
      explorerUrl={explorerUrl}
    />
  );
};
