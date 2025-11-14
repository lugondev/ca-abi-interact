import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { FunctionInputs, TAbiFunction, TContract } from "@entities/contract";
import { FetchCallResult } from "./FetchCallResult";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
};

export const GetterCall = ({ contract, abiItem }: TProps) => {
  const [args, setArgs] = useState<string[] | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex-[100%]">
        <FunctionInputs
          abiItem={abiItem}
          onSubmit={setArgs}
          buttonText="Fetch"
        />
      </div>

      {args && (
        <div className="flex-[100%]">
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <FetchCallResult
                contract={contract}
                abiItem={abiItem}
                args={args}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
