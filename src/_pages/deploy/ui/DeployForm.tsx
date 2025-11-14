import { TAbiItem } from "@entities/contract";
import { THexString } from "@shared/lib/web3";
import { Row, Col2, FlexVertical } from "@shared/ui/Grid";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { isHex } from "viem";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type TProps = {
  onChange: (_abi: TAbiItem[], _byteCode: THexString) => void;
};

const validateHexString = (value: string): THexString => {
  return isHex(value) ? value : `0x${value}`;
};

export const DeployForm = ({ onChange }: TProps) => {
  const [abi, setAbi] = useState<string>("");
  const [byteCode, setByteCode] = useState<string>("");
  const [abiError, setAbiError] = useState("");

  const getAbiObject = (value: string) => {
    try {
      setAbiError("");
      return JSON.parse(value) as TAbiItem[];
    } catch {
      setAbiError("Invalid ABI");
      return [];
    }
  };

  const handleAbiChange = (value: string) => {
    setAbi(value);

    onChange(getAbiObject(value), validateHexString(byteCode));
  };

  const handleByteCodeChange = (value: string) => {
    setByteCode(value);

    onChange(getAbiObject(abi), validateHexString(value));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        try {
          setAbiError("");

          const data = JSON.parse(fileReader.result.toString());

          setAbi(JSON.stringify(data.abi, null, 2));
          setByteCode(data.bytecode);

          onChange(data.abi, data.bytecode);
        } catch {
          setAbiError("Invalid file");
        }
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <FlexVertical>
      <Row>
        <Col2>
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
              "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
              "border-gray-300 dark:border-gray-600"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload JSON artifact
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
          </label>
        </Col2>
      </Row>
      <Row>
        <Col2>
          <Textarea
            rows={20}
            className={cn(abiError && "border-red-500")}
            onChange={(e) => handleAbiChange(e.target.value)}
            value={abi}
            placeholder="ABI JSON"
          />
          {abiError && (
            <p className="text-sm text-red-500 mt-1">{abiError}</p>
          )}
        </Col2>
        <Col2>
          <Textarea
            rows={20}
            onChange={(e) => handleByteCodeChange(e.target.value)}
            value={byteCode}
            placeholder="Bytecode"
          />
        </Col2>
      </Row>
    </FlexVertical>
  );
};
