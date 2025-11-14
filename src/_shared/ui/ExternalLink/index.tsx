import { cn } from "@/lib/utils";
import { TWithChildren, TWithClassname } from "@shared/lib/props";

type TProps = TWithChildren &
  TWithClassname & {
    href: string;
  };

export const ExternalLink = ({ children, className, href }: TProps) => {
  return (
    <a
      className={cn("text-blue-500 hover:underline", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

