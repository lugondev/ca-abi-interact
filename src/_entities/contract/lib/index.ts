import type { TAbiItem, TAbiParamType, TAbiParam } from "../model/types";

import { AbiConstructor, AbiEvent, AbiFunction } from "abitype";

const isReadonlyFunction = (item: TAbiItem): item is AbiFunction =>
  item.type == "function" &&
  (item.stateMutability == "pure" || item.stateMutability == "view");

const isWriteFunction = (item: TAbiItem): item is AbiFunction =>
  item.type == "function" && !isReadonlyFunction(item);

export const isAbiItemProperty = (item: TAbiItem): item is AbiFunction =>
  isReadonlyFunction(item) && item.inputs.length == 0;

export const isAbiItemParamCall = (item: TAbiItem): item is AbiFunction =>
  isReadonlyFunction(item) && item.inputs.length !== 0;

export const isAbiItemOperation = (item: TAbiItem): item is AbiFunction =>
  isWriteFunction(item);

export const isAbiItemEvent = (item: TAbiItem): item is AbiEvent =>
  item.type === "event";

export const isAbiItemConstructor = (item: TAbiItem): item is AbiConstructor =>
  item.type === "constructor";

export const isArrayType = (param: TAbiParamType) => param.endsWith("]");

export const getArrayItemType = (param: TAbiParamType) => {
  const bracketIndex = param.lastIndexOf("[");
  return bracketIndex > 0 ? param.slice(0, bracketIndex) : param.slice(0, -2);
};

export const isTupleType = (param: TAbiParamType) => 
  param === "tuple" || param.startsWith("tuple[") || param.startsWith("tuple(");

export const getDefaultValue = (param: TAbiParamType) => {
  switch (param) {
    case "bool":
      return false;
    case "address":
      return "0x0000000000000000000000000000000000000000";
    case "eth":
    case "ether":
    case "uint256":
    case "uint128":
    case "uint64":
    case "uint32":
    case "uint16":
    case "uint8":
      return "0";
    default:
      if (isArrayType(param)) {
        return [];
      } else {
        return "";
      }
  }
};

/**
 * Helper to convert string boolean representations to actual boolean
 */
const convertStringToBoolean = (value: string | unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  
  const lower = value.toLowerCase().trim();
  return lower === "true" || lower === "1" || lower === "yes";
};

/**
 * Recursively convert boolean strings in arrays/objects to actual booleans
 */
const convertBooleansInValue = (
  value: unknown,
  input: TAbiParam | TAbiParamType
): unknown => {
  const inputType = typeof input === "string" ? input : input.type;

  // If it's a boolean type, convert string to boolean
  if (inputType === "bool") {
    return convertStringToBoolean(value);
  }

  // If it's an array type, process each item
  if (isArrayType(inputType) && Array.isArray(value)) {
    const itemType = getArrayItemType(inputType);
    
    // If input is full TAbiParam object and has components (for tuple[]), use it
    if (typeof input !== "string" && "components" in input && input.components) {
      // This is a tuple[], each item in the array should match the tuple structure
      return value.map((item) => {
        // Create a synthetic TAbiParam for each tuple item in the array
        const tupleParam: TAbiParam = {
          type: itemType as TAbiParamType,
          components: input.components,
        };
        return convertBooleansInValue(item, tupleParam);
      });
    }
    
    // Otherwise, just process with itemType string
    return value.map((item) => convertBooleansInValue(item, itemType));
  }

  // If it's a tuple type, process each component
  if (isTupleType(inputType) && typeof input !== "string" && "components" in input) {
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const component = input.components?.[index];
        if (component) {
          return convertBooleansInValue(item, component);
        }
        return item;
      });
    }
    if (typeof value === "object" && value !== null) {
      const result: Record<string, unknown> = {};
      input.components?.forEach((component, index) => {
        const key = component.name || String(index);
        const itemValue = (value as Record<string, unknown>)[key] ?? 
                         (value as Record<string, unknown>)[String(index)] ?? 
                         (Array.isArray(value) ? value[index] : undefined);
        result[key] = convertBooleansInValue(itemValue, component);
      });
      return result;
    }
  }

  return value;
};

/**
 * Parse argument value from string to appropriate type for viem
 * Handles JSON strings (arrays, tuples) and basic types
 */
export const parseArgValue = (arg: string, input: TAbiParam | TAbiParamType): unknown => {
  if (!arg || !arg.trim()) {
    const inputType = typeof input === "string" ? input : input.type;
    // Return empty value based on type
    if (isArrayType(inputType)) {
      return [];
    }
    if (isTupleType(inputType)) {
      return [];
    }
    if (inputType === "bool") {
      return false;
    }
    return "";
  }

  const inputType = typeof input === "string" ? input : input.type;

  // Handle boolean type first - convert string "1"/"0" or "true"/"false" to boolean
  if (inputType === "bool") {
    return convertStringToBoolean(arg);
  }

  // Try to parse as JSON first (for arrays and tuples)
  let parsed: unknown;
  try {
    parsed = JSON.parse(arg);
  } catch {
    // If not valid JSON, check if it's an array type and try comma-separated format
    if (isArrayType(inputType)) {
      const items = arg.split(",").map((item) => item.trim()).filter(Boolean);
      const itemType = getArrayItemType(inputType);
      // Convert boolean strings in array items
      return items.map((item) => convertBooleansInValue(item, itemType));
    }
    // For tuple types, if not JSON, return empty array (user needs to input JSON)
    if (isTupleType(inputType)) {
      return [];
    }
    // Otherwise return as-is
    return arg;
  }

  // After parsing JSON, convert any boolean strings in nested structures
  return convertBooleansInValue(parsed, input);
};

/**
 * Parse multiple arguments for function call
 */
export const parseFunctionArgs = (
  args: string[],
  inputs: readonly TAbiParam[]
): unknown[] => {
  return args.map((arg, index) => {
    const input = inputs[index];
    return parseArgValue(arg, input);
  });
};
