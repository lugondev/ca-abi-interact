type TPageLink = {
  path: string;
  title: string;
};

type TProps = {
  pages: TPageLink[];
};

import Link from "next/link";
import { cn } from "@/lib/utils";

export const Navigation = ({ pages }: TProps) => {
  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-lg">SmartContracts</span>
      </Link>
      <div className="flex gap-4">
        {pages.map(({ path, title }) => (
          <Link
            key={path}
            href={path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              "text-muted-foreground"
            )}
          >
            {title}
          </Link>
        ))}
      </div>
    </nav>
  );
};
