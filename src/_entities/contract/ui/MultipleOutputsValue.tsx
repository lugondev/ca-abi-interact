import { TAbiParam } from "../model/types";
import { ParamValue } from "./ParamValue";
import { TChainId } from "@shared/lib/web3";
import { chainModel } from "@entities/chain";

type TProps = {
  outputs: readonly TAbiParam[];
  value: unknown;
  chain?: TChainId;
  shorten?: boolean;
};

export const MultipleOutputsValue = ({
  outputs,
  value,
  chain,
  shorten = true,
}: TProps) => {
  const { getAddressUrl } = chainModel.useChainExplorer(chain || 1);

  // If only one output, always use ParamValue (handles arrays, tuples, etc.)
  if (outputs.length === 1) {
    const output = outputs[0];
    const explorerUrl =
      output.type === "address" ? getAddressUrl(value as any) : undefined;
    return (
      <ParamValue
        abiType={output.type}
        value={value}
        chain={chain}
        shorten={shorten}
        explorerUrl={explorerUrl}
        abiParam={output}
      />
    );
  }

  // Multiple outputs: value should be an array matching outputs length
  if (!Array.isArray(value)) {
    // Multiple outputs but value is not array - this shouldn't happen, but handle gracefully
    return (
      <ParamValue
        abiType={outputs[0]?.type || "unknown"}
        value={value}
        chain={chain}
        shorten={shorten}
      />
    );
  }

  // Display each output with its name
  // Note: value array length should match outputs length for multiple return values
  return (
    <div className="space-y-2">
      {outputs.map((output, index) => {
        const fieldName = output.name || `output${index}`;
        const fieldValue = value[index];
        const explorerUrl =
          output.type === "address"
            ? getAddressUrl(fieldValue as any)
            : undefined;

        return (
          <div key={index} className="border-l-2 border-muted pl-3 space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                {fieldName}:
              </span>
              <div className="flex-1 min-w-0">
                <ParamValue
                  abiType={output.type}
                  value={fieldValue}
                  chain={chain}
                  shorten={shorten}
                  explorerUrl={explorerUrl}
                  abiParam={output}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
