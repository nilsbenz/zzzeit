import { Link } from "@tanstack/react-router";
import { HourglassIcon } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="pl-[env(safe-area-inset-left, 0px)] pr-[env(safe-area-inset-right, 0px)] fixed left-0 right-0 top-0 z-50 border-b-2 bg-background/80 pt-[--safe-area-top] backdrop-blur-sm">
        <div className="-mb-0.5 flex h-14 items-center gap-2">
          <Link
            to="/"
            className="h-9 px-2 ml-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <div className="flex items-center gap-3 h-full">
              <HourglassIcon className="size-6 scale-90" strokeWidth={3} />
              <h1 className="text-lg font-bold">zzzeit</h1>
            </div>
          </Link>
        </div>
      </header>
      <div className="h-14 w-full" />
    </>
  );
}
