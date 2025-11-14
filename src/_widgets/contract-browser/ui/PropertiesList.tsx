import { AbiFunction } from "abitype";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TContract, contractModel } from "@entities/contract";
import { PropertyCall } from "@features/execute-contract";

type TProps = {
  contract: TContract;
};

export const PropertiesList = ({ contract }: TProps) => {
  const functions = contractModel.useContractProperties(contract);

  return (
    <div className="w-full overflow-hidden">
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
  );
};
