"use client";

import { useState } from "react";
import { Routes } from "@shared/config/routes";
import { Navigation } from "./Navigation";
import { SetCurrentChain } from "@features/set-current-chain";
import { WalletCard, walletModel } from "@entities/wallet";
import { ConnectButton } from "@features/connect-wallet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WalletBlock = () => {
  const { address } = walletModel.useCurrentWallet();

  if (address) {
    return <WalletCard wallet={address} />;
  }

  return <ConnectButton />;
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          <nav className="flex flex-col gap-4">
            {Routes.map(({ path, title }) => (
              <Link
                key={path}
                href={path}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
                  "text-muted-foreground"
                )}
              >
                {title}
              </Link>
            ))}
          </nav>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Wallet</span>
              <WalletBlock />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Network</span>
              <SetCurrentChain />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-screen-2xl">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">SmartContracts</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <Navigation pages={Routes} />
            <WalletBlock />
            <Separator orientation="vertical" className="h-6" />
            <div className="min-w-[200px]">
              <SetCurrentChain />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
