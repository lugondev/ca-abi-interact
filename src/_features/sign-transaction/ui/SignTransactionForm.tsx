import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TTransactionParams } from "@shared/lib/tx";
import { AddressInput } from "@shared/ui/AddressInput";
import { Row, Col2, Col3, Col1 } from "@shared/ui/Grid";
import { TAbiFunction, TContract } from "@entities/contract";
import { AmountInput, Mode } from "@shared/ui/AmountInput";
import { useTransactionParamsForm } from "../model";
import { DownloadTransaction } from "./DownloadTransaction";

type TProps = {
  contract: TContract;
  abiItem: TAbiFunction;
  args: string[];
  disabled?: boolean;
  onSubmit: (_values: TTransactionParams) => void;
};

export const SignTransactionForm = ({
  contract,
  abiItem,
  args,
  disabled,
  onSubmit,
}: TProps) => {
  const { values, payable, onValuesChange } = useTransactionParamsForm(
    contract,
    abiItem,
    args
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Row>
        <Col2>
          <div className="space-y-2">
            <Label htmlFor="from" className="required">
              From address
            </Label>
            <AddressInput
              value={values.from}
              onChange={(from) => onValuesChange({ from })}
              disabled={disabled}
            />
          </div>
        </Col2>
        <Col2>
          <div className="space-y-2">
            <Label htmlFor="to">To address</Label>
            <AddressInput value={values.to} onChange={() => {}} disabled />
          </div>
        </Col2>
      </Row>

      <Row>
        <Col3>
          <div className="space-y-2">
            <Label htmlFor="value">ETH value</Label>
            <AmountInput
              value={values.value}
              onChange={(value) => onValuesChange({ value })}
              disabled={!payable || disabled}
              defaultMode={Mode.ETH}
            />
          </div>
        </Col3>

        <Col3>
          <div className="space-y-2">
            <Label htmlFor="nonce" className="required">
              Nonce
            </Label>
            <Input
              id="nonce"
              type="number"
              value={values.nonce}
              onChange={(e) =>
                onValuesChange({ nonce: Number(e.target.value) })
              }
              disabled={disabled}
              required
            />
          </div>
        </Col3>
      </Row>

      <Row>
        <Col3>
          <div className="space-y-2">
            <Label htmlFor="gas" className="required">
              Gas limit
            </Label>
            <Input
              id="gas"
              type="number"
              value={values.gas}
              onChange={(e) => onValuesChange({ gas: parseInt(e.target.value) || 0 })}
              disabled={disabled}
              required
            />
          </div>
        </Col3>
        <Col3>
          <div className="space-y-2">
            <Label htmlFor="maxFee" className="required">
              Max fee per gas
            </Label>
            <AmountInput
              value={values.maxFee}
              onChange={(maxFee) => onValuesChange({ maxFee })}
              disabled={disabled}
              defaultMode={Mode.GWEI}
            />
          </div>
        </Col3>
        <Col3>
          <div className="space-y-2">
            <Label htmlFor="maxPriorityFee" className="required">
              Max priority fee per gas
            </Label>
            <AmountInput
              value={values.maxPriorityFee}
              onChange={(maxPriorityFee) => onValuesChange({ maxPriorityFee })}
              disabled={disabled}
              defaultMode={Mode.GWEI}
            />
          </div>
        </Col3>
      </Row>

      <Row>
        <Col1>
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Textarea
              id="data"
              rows={5}
              value={values.data}
              onChange={(e) => onValuesChange({ data: e.target.value as `0x${string}` })}
              disabled={disabled}
            />
          </div>
        </Col1>
      </Row>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={disabled}>
          Sign
        </Button>

        <DownloadTransaction fetchTxFields={() => values} />
      </div>
    </form>
  );
};
