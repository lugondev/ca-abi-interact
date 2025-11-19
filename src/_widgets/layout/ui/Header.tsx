"use client";

import { useState } from "react";
import { Routes } from "@shared/config/routes";
import { Navigation } from "./Navigation";
import { SetCurrentChain } from "@features/set-current-chain";
import { WalletCard, walletModel } from "@entities/wallet";
import { ConnectButton } from "@features/connect-wallet";
import { SettingsDialog } from "@features/settings";
import { ThemeToggle } from "@features/theme-toggle";
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
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm font-medium">Settings</span>
                <SettingsDialog />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/5 to-success/6 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto max-w-screen-2xl relative">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <MobileNav />
            <Link href="/" className="flex items-center space-x-3 group transition-all">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-2xl group-hover:bg-primary/60 transition-all duration-500" />
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-accent to-success flex items-center justify-center shadow-2xl shadow-primary/50 group-hover:shadow-primary/70 transition-all duration-300 border-2 border-primary/30 group-hover:border-primary/50">
                  <span className="text-white font-display font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">SC</span>
                </div>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  SmartContracts
                </span>
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.15em] group-hover:text-accent transition-colors duration-300">
                  ▸ ABI Interact
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 ml-auto min-w-0">
            <Navigation pages={Routes} />
            <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <WalletBlock />
            <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="w-[180px] lg:min-w-[220px] shrink-0">
              <SetCurrentChain />
            </div>
            <ThemeToggle />
            <SettingsDialog />
          </div>
        </div>
      </div>
    </header>
  );
};
