import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Header, { HeaderAction } from "./Header";
import { Navigation } from "./Navigation";

export default function Layout({
  title,
  backButton,
  headerActions,
  className,
  children,
}: {
  title?: string;
  backButton?: boolean;
  headerActions?: HeaderAction[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto_1fr_auto] pl-safe-left pr-safe-right sm:grid-cols-[auto_1fr] sm:grid-rows-[auto_1fr] standalone:h-screen">
      <Header title={title} backButton={backButton} actions={headerActions} />
      <Navigation />
      <main
        className={cn("mx-auto w-full max-w-2xl px-4 py-8 lg:px-8", className)}
      >
        {children}
      </main>
    </div>
  );
}
