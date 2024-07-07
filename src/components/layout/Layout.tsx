import { ReactNode } from "react";
import Header, { HeaderAction } from "./Header";
import { Navigation } from "./Navigation";

export default function Layout({
  title,
  backButton,
  headerActions,
  children,
}: {
  title?: string;
  backButton?: boolean;
  headerActions?: HeaderAction[];
  children?: ReactNode;
}) {
  return (
    <>
      <Header title={title} backButton={backButton} actions={headerActions} />
      <div className="flex flex-col sm:flex-row-reverse">
        <main className="mx-auto h-full w-full max-w-2xl px-4 py-8 lg:px-8">
          {children}
        </main>
        <Navigation />
      </div>
    </>
  );
}
