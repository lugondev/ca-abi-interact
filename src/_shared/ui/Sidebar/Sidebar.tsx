"use client";

import { ReactNode, useState } from "react";
import { TWithChildren, TWithClassname } from "@shared/lib/props";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  return (
    <section className="flex w-full gap-3">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <PanelLeft className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {sidebar}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  );
};

