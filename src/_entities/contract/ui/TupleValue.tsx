import { TAbiParam } from "../model/types";
import { ParamValue } from "./ParamValue";
import { TAddress, TChainId } from "@shared/lib/web3";

type TProps = {
  abiParam: TAbiParam;
  value: unknown;
  chain?: TChainId;
  shorten?: boolean;
  explorerUrl?: string;
  level?: number;
};

export const TupleValue = ({ 
  abiParam, 
  value, 
  chain, 
  shorten = true, 
  explorerUrl,
  level = 0 
}: TProps) => {
  // Check if this is a tuple type with components
  const isTuple = abiParam.type === "tuple" || abiParam.type.startsWith("tuple");
  const hasComponents = "components" in abiParam && abiParam.components && abiParam.components.length > 0;
  
  if (!isTuple || !hasComponents) {
    // Fallback to regular ParamValue if not a tuple or no components
    return (
      <ParamValue 
        abiType={abiParam.type} 
        value={value} 
        chain={chain} 
        shorten={shorten}
        explorerUrl={explorerUrl}
      />
    );
  }

  const components = abiParam.components;
  const paddingLeft = level * 16;
  
  // Ensure we have the right number of components for the array length
  // If value is an array, it should match the number of components
  if (Array.isArray(value) && value.length !== components.length) {
    // If array length doesn't match, it might be a tuple array (tuple[])
    // or the value might be incorrectly structured
    // Still try to display what we can
  }

  // Handle tuple as object (when decoded by viem with named components)
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const valueObj = value as Record<string | number, unknown>;
    return (
      <div className="space-y-2" style={{ paddingLeft: `${paddingLeft}px` }}>
        {components.map((component, index) => {
          const fieldName = component.name || `field${index}`;
          // Try to get value by name first, then by index
          const fieldValue = valueObj[fieldName] ?? valueObj[String(index)] ?? valueObj[index];
          
          // Check if this component is also a tuple
          const isNestedTuple = component.type === "tuple" || component.type.startsWith("tuple");
          
          return (
            <div key={index} className="border-l-2 border-muted pl-3 space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                  {fieldName}:
                </span>
                <div className="flex-1 min-w-0">
                  {isNestedTuple && "components" in component && component.components ? (
                    <TupleValue
                      abiParam={component}
                      value={fieldValue}
                      chain={chain}
                      shorten={shorten}
                      level={level + 1}
                    />
                  ) : (
                    <ParamValue
                      abiType={component.type}
                      value={fieldValue}
                      chain={chain}
                      shorten={shorten}
                      explorerUrl={component.type === "address" ? explorerUrl : undefined}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Handle tuple as array (when returned as array)
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2" style={{ paddingLeft: `${paddingLeft}px` }}>
        {components.map((component, index) => {
          const fieldName = component.name || `field${index}`;
          const fieldValue = value[index];
          
          // Check if this component is also a tuple
          const isNestedTuple = component.type === "tuple" || component.type.startsWith("tuple");
          
          return (
            <div key={index} className="border-l-2 border-muted pl-3 space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                  {fieldName}:
                </span>
                <div className="flex-1 min-w-0">
                  {isNestedTuple && "components" in component && component.components ? (
                    <TupleValue
                      abiParam={component}
                      value={fieldValue}
                      chain={chain}
                      shorten={shorten}
                      level={level + 1}
                    />
                  ) : (
                    <ParamValue
                      abiType={component.type}
                      value={fieldValue}
                      chain={chain}
                      shorten={shorten}
                      explorerUrl={component.type === "address" ? explorerUrl : undefined}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback for other cases
  return (
    <ParamValue 
      abiType={abiParam.type} 
      value={value} 
      chain={chain} 
      shorten={shorten}
      explorerUrl={explorerUrl}
    />
  );
};

