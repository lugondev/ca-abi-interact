import { TAbiFunction, TContract, ParamValue, MultipleOutputsValue } from "@entities/contract";
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

  // Handle multiple outputs
  if (abiItem.outputs.length > 1) {
    return (
      <MultipleOutputsValue
        outputs={abiItem.outputs}
        value={data}
        chain={contract.chain}
      />
    );
  }

  // Single output - use ParamValue
  const outputParam = abiItem.outputs[0];
  const outputType = outputParam.type;
  const explorerUrl = outputType === "address" ? getAddressUrl(data as any) : undefined;

  return (
    <ParamValue 
      value={data} 
      abiType={outputType} 
      chain={contract.chain}
      explorerUrl={explorerUrl}
      abiParam={outputParam}
    />
  );
};
