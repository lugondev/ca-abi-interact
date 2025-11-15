import { useWalletClient } from "wagmi";
import { useState } from "react";
import { chainModel } from "@entities/chain";
import { walletModel } from "@entities/wallet";
import { TAbiConstructor } from "@entities/contract";
import { useNotifications } from "@shared/lib/notify";
import { useWatchTxNotification } from "@features/sign-transaction/";
import { THexString } from "@shared/lib/web3";

export const useDeployTransaction = () => {
  const { data: walletClient } = useWalletClient();
  const { chain } = chainModel.useCurrentChain();

  const [hash, setHash] = useState<THexString | undefined>(undefined);

  const switchChain = walletModel.useSwitchWalletChain(chain);
  const notify = useNotifications();

  const sendTransaction = async (
    ctor: TAbiConstructor | null,
    byteCode: THexString,
    values: string[]
  ) => {
    try {
      if (!walletClient) {
        notify("Wallet not connected", "error");
        return;
      }

      if (!ctor) {
        notify("No constructor in ABI", "error");
        return;
      }

      // Switch chain if needed
      await switchChain();

      const hash = await walletClient.deployContract({
        abi: [ctor],
        bytecode: byteCode,
        args: values,
      });
      setHash(hash);
    } catch (e) {
      console.error("Deploy transaction error:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "Failed to deploy contract";
      notify(errorMessage, "error");
    }
  };

  useWatchTxNotification(chain, hash);

  return sendTransaction;
};
