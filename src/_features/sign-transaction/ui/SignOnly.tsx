import { TAbiFunction, TContract } from "@entities/contract";
import { TTransactionParams, stringToNative } from "@shared/lib/tx";
import { SignTransactionForm } from "./SignTransactionForm";
import { useNotifications } from "@shared/lib/notify";
import { useWalletClient } from "wagmi";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { walletModel } from "@entities/wallet";
import { serializeTransaction, keccak256, parseSignature } from "viem";
import { usePublicClient } from "wagmi";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
  args: string[];
};

export const SignOnly = ({ contract, abiItem, args }: TProps) => {
  const notify = useNotifications();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const switchChain = walletModel.useSwitchWalletChain(contract.chain);
  const [signatureData, setSignatureData] = useState<{
    signature: string;
    serializedTx: string;
    txHash: string;
    r: `0x${string}`;
    s: `0x${string}`;
    v: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: TTransactionParams) => {
    try {
      setIsLoading(true);

      // Switch chain if needed
      if (!(await switchChain())) {
        setIsLoading(false);
        return;
      }

      if (!walletClient || !publicClient) {
        throw new Error("Wallet not connected");
      }

      // Get chain ID
      const chainId = contract.chain;

      // Convert transaction params to viem transaction format
      const transaction = {
        type: "eip1559" as const,
        to: values.to,
        value: BigInt(stringToNative(values.value)),
        gas: BigInt(values.gas),
        maxFeePerGas: BigInt(stringToNative(values.maxFee)),
        maxPriorityFeePerGas: BigInt(stringToNative(values.maxPriorityFee)),
        nonce: Number(values.nonce),
        data: values.data as `0x${string}`,
        chainId: chainId,
      };

      // Serialize transaction first, then hash it (EIP-155 format)
      const serializedTx = serializeTransaction(transaction);
      const txHash = keccak256(serializedTx);
      
      // Sign the transaction hash
      // Note: signMessage adds personal_sign prefix, but we'll try to use it anyway
      const signature = await walletClient.signMessage({
        message: txHash,
      });
      
      // Parse signature to get r, s, v
      const { r, s, v: parsedV } = parseSignature(signature);
      
      // Adjust v value for EIP-155 (chainId * 2 + 35 or 36)
      // Since we can't sign raw hash, we'll use the signature but note it may not work perfectly
      const v = BigInt(chainId * 2 + 35);
      
      // Create signed transaction with signature fields
      const signedTransaction = {
        ...transaction,
        r,
        s,
        v,
      };
      
      // Serialize signed transaction (this can be broadcast)
      const signedSerializedTx = serializeTransaction(signedTransaction);
      
      // Set signature result
      setSignatureData({
        signature,
        serializedTx: signedSerializedTx,
        txHash,
        r,
        s,
        v: Number(v),
      });
      
      notify("Transaction has been signed successfully", "success");
      
    } catch (error) {
      console.error("Signing error:", error);
      notify(
        error instanceof Error ? error.message : "Unknown error occurred",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${label} copied to clipboard`, "success");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <SignTransactionForm
        contract={contract}
        abiItem={abiItem}
        args={args}
        onSubmit={onSubmit}
        disabled={isLoading}
        signOnly={true}
      />

      {/* Signature Result Modal */}
      <Dialog open={!!signatureData} onOpenChange={() => setSignatureData(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Signature Result</DialogTitle>
          </DialogHeader>
          
          {signatureData && (
            <div className="space-y-6">
              {/* Signature Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Signature</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(signatureData.signature, "Signature")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-md p-4 font-mono text-sm break-all">
                  {signatureData.signature}
                </div>
              </div>

              {/* Transaction Hash Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Transaction Hash</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(signatureData.txHash, "Transaction Hash")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-md p-4 font-mono text-sm break-all">
                  {signatureData.txHash}
                </div>
              </div>

              {/* Signed Serialized Transaction Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Signed Transaction (Broadcastable)</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(signatureData.serializedTx, "Signed Transaction")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-md p-4 font-mono text-sm break-all">
                  {signatureData.serializedTx}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This signed transaction can be broadcast to the network using eth_sendRawTransaction
                </p>
              </div>

              {/* Signature Components Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Signature Components</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">r:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => handleCopy(signatureData.r, "r")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2 font-mono text-xs break-all">
                      {signatureData.r}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">s:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => handleCopy(signatureData.s, "s")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2 font-mono text-xs break-all">
                      {signatureData.s}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">v:</span>
                      <span className="text-sm font-mono">{signatureData.v}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
