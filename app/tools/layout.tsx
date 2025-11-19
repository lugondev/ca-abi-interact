import Link from "next/link";

const tools = [
  { name: "Eth Unit Converter", href: "/tools/eth-unit-converter" },
  { name: "Token Unit Converter", href: "/tools/token-unit-converter" },
  { name: "Epoch Converter", href: "/tools/epoch-converter" },
  { name: "Base Converter", href: "/tools/base-converter" },
  { name: "String Bytes32", href: "/tools/string-bytes32" },
  { name: "Calldata Decoder", href: "/tools/calldata-decoder" },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-2">
            <h2 className="font-bold text-lg mb-4 px-4">Tools</h2>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
