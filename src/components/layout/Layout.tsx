import { ReactNode } from "react";
import Header from "./Header";
import { Navigation } from "./Navigation";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col sm:flex-row-reverse">
        <main className="h-full w-full px-4 py-8 lg:px-8 max-w-2xl mx-auto">
          {children}
        </main>
        <Navigation />
      </div>
    </>
  );
}
