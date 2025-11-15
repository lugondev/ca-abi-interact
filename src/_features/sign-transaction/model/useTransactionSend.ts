import { TTransactionParams, stringToNative } from "@shared/lib/tx";
import { useCallback, useState } from "react";
import { useSendTransaction, useConfig } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { TChainId, THexString } from "@shared/lib/web3";
import { walletModel } from "@entities/wallet";
import { useNotifications } from "@shared/lib/notify";

import { useWatchTxNotification } from "./useTxNotification";

const convertTx = (tx: TTransactionParams) => {
  // Convert string values (already in wei) to bigint
  // Gas fees are stored as strings in wei, so we can convert directly to BigInt
  const maxFeePerGas = tx.maxFee ? BigInt(tx.maxFee) : undefined;
  const maxPriorityFeePerGas = tx.maxPriorityFee ? BigInt(tx.maxPriorityFee) : undefined;

  return {
    to: tx.to,
    value: stringToNative(tx.value),
    gas: BigInt(tx.gas),
    ...(maxFeePerGas !== undefined && { maxFeePerGas }),
    ...(maxPriorityFeePerGas !== undefined && { maxPriorityFeePerGas }),
    data: tx.data,
  };
};

export const usePrepareTransactionSend = (tx?: TTransactionParams) => {
  const { data, isPending, isSuccess, sendTransaction } = useSendTransaction();

  const sendTx = useCallback(() => {
    if (tx) {
      sendTransaction(convertTx(tx));
    }
  }, [tx, sendTransaction]);

  return {
    send: sendTx,
    hash: data,
    inProgress: isPending,
    success: isSuccess,
  };
};

export const useTransactionSend = (chain: TChainId) => {
  const [txHash, setTxHash] = useState("");
  const config = useConfig();
  const notify = useNotifications();

  const switchChain = walletModel.useSwitchWalletChain(chain);

  const send = useCallback(
    async (tx: TTransactionParams) => {
      try {
        // Try to switch chain if needed
        await switchChain();

        // Send transaction
        const hash = await sendTransaction(config, convertTx(tx));
        setTxHash(hash);
        notify("Transaction sent successfully", "success");
      } catch (e) {
        console.error("Transaction send error:", e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : typeof e === "string"
            ? e
            : "Failed to send transaction";
        notify(errorMessage, "error");
      }
    },
    [switchChain, config, notify]
  );

  useWatchTxNotification(chain, txHash as THexString);

  return {
    hash: txHash,
    send,
  };
};
