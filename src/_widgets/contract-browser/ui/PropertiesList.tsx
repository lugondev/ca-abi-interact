import { AbiFunction } from "abitype";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TContract, contractModel } from "@entities/contract";
import { PropertyCall } from "@features/execute-contract";
import { GlobalRefreshButton } from "@shared/ui/GlobalRefreshButton";

type TProps = {
  contract: TContract;
};

export const PropertiesList = ({ contract }: TProps) => {
  const functions = contractModel.useContractProperties(contract);

  if (functions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No properties found in this contract.</p>
        <p className="text-sm mt-2">Properties are readonly functions without input parameters.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden space-y-4">
      <div className="flex justify-end">
        <GlobalRefreshButton />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] min-w-[100px]">Name</TableHead>
              <TableHead className="min-w-0">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {functions.map((abiItem) => (
              <TableRow key={abiItem.name}>
                <TableCell className="font-medium align-top">{abiItem.name}</TableCell>
                <TableCell className="min-w-0 max-w-0">
                  <PropertyCall contract={contract} abiItem={abiItem} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
