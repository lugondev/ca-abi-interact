import { ParamValue, TAbiEvent, TEventLogs } from "@entities/contract";
import { TChainId } from "@shared/lib/web3";
import { ExternalLink } from "@shared/ui/ExternalLink";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { chainModel } from "@entities/chain";

type TProps = {
  chain: TChainId;
  event: TAbiEvent;
  items: TEventLogs;
  loading?: boolean;
};

export const EventsTable = ({ chain, event, items, loading }: TProps) => {
  const { getTxUrl, getAddressUrl } = chainModel.useChainExplorer(chain);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {event.inputs.map((input, index) => (
              <TableHead key={input.name || index} className="min-w-[120px]">
                {input.name || `Param ${index}`}
              </TableHead>
            ))}
            <TableHead className="w-[100px]">Block</TableHead>
            <TableHead className="w-[140px]">TxHash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={`${item.transactionHash}${item.logIndex}`}>
              {event.inputs.map((input, index) => {
                const value = Array.isArray(item.args) 
                  ? item.args[index] 
                  : (item.args as Record<string, unknown>)[input.name || index];
                const explorerUrl = input.type === "address" ? getAddressUrl(value as any) : undefined;
                return (
                  <TableCell key={input.name || index} className="min-w-0 align-top">
                    <ParamValue 
                      abiType={input.type} 
                      value={value} 
                      chain={chain}
                      explorerUrl={explorerUrl}
                      abiParam={input}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="align-top">
                <span className="text-sm">{String(item.blockNumber)}</span>
              </TableCell>
              <TableCell className="align-top">
                <ExternalLink href={getTxUrl(item.transactionHash)} className="text-sm">
                  {`${item.transactionHash.slice(0, 6)}...${item.transactionHash.slice(-4)}`}
                </ExternalLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
