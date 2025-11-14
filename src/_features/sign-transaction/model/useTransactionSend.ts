import { TTransactionParams, stringToNative } from "@shared/lib/tx";
import { useCallback, useState } from "react";
import { useSendTransaction, useConfig } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { TChainId, THexString } from "@shared/lib/web3";
import { walletModel } from "@entities/wallet";

import { useWatchTxNotification } from "./useTxNotification";

const convertTx = (tx: TTransactionParams) => ({
  ...tx,
  gas: stringToNative(tx.gas),
  value: stringToNative(tx.value),
});

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

  const switchChain = walletModel.useSwitchWalletChain(chain);

  const send = useCallback(
    async (tx: TTransactionParams) => {
      try {
        if (await switchChain()) {
          const hash = await sendTransaction(config, convertTx(tx));
          setTxHash(hash);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [switchChain, config]
  );

  useWatchTxNotification(chain, txHash as THexString);

  return {
    hash: txHash,
    send,
  };
};
