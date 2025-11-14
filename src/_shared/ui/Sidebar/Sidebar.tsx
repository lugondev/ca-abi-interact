import { ReactNode } from "react";
import { TWithChildren, TWithClassname } from "@shared/lib/props";
import { cn } from "@/lib/utils";

type TProps = TWithChildren & {
  sidebar: ReactNode;
};

export const Sidebar = ({
  children,
  className,
}: TWithChildren & TWithClassname) => {
  return (
    <aside className={cn("border-r bg-muted/40", className)}>
      {children}
    </aside>
  );
};

export const WithSidebar = ({ children, sidebar }: TProps) => {
  return (
    <section className="flex w-full gap-3">
      {sidebar}
      <div className="flex-1">{children}</div>
    </section>
  );
};

