import { ReactNode } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

type TProps = {
  children: ReactNode;
};

export const Layout = ({ children }: TProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-4 px-3 w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
