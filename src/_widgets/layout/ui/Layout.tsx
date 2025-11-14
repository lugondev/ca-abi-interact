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
        <div className="container mx-auto py-4 px-3 sm:px-4 md:px-6 w-full max-w-screen-2xl">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
