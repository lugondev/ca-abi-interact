import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tools = [
  {
    name: "Eth Unit Converter",
    description: "Convert between Wei, Gwei, Ether and other units.",
    href: "/tools/eth-unit-converter",
  },
  {
    name: "Token Unit Converter",
    description: "Convert ERC20 token amounts with custom decimals.",
    href: "/tools/token-unit-converter",
  },
  {
    name: "Epoch Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    href: "/tools/epoch-converter",
  },
  {
    name: "Base Converter",
    description: "Convert between Hexadecimal, Decimal, and Binary.",
    href: "/tools/base-converter",
  },
  {
    name: "String Bytes32",
    description: "Convert strings to bytes32 and vice versa.",
    href: "/tools/string-bytes32",
  },
  {
    name: "Calldata Decoder",
    description: "Decode transaction calldata into human-readable format.",
    href: "/tools/calldata-decoder",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
        <p className="text-muted-foreground mt-2">
          A collection of essential tools for Ethereum developers.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
