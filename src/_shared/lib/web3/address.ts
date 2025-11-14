import { isAddress } from "viem";

export type THexString = `0x${string}`;

export type TAddress = THexString;

export const sameAddress = (a: TAddress, b: TAddress) =>
  a.toLowerCase() === b.toLowerCase();

export const isEvmAddress = (a: string): a is TAddress => {
  return isAddress(a);
};

export const shortenAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

