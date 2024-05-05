import { auth } from "@/lib/firebase";
import { Link } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { HourglassIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b-2 bg-background/80 pl-safe-left pr-safe-right pt-safe-top backdrop-blur-sm">
        <div className="-mb-0.5 flex h-14 items-center justify-between gap-2">
          <Link
            to="/"
            className="ml-2 h-9 rounded-md px-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-full items-center gap-1.5 lg:gap-3">
              <div className="animate-hourglass">
                <HourglassIcon className="size-6 scale-90" strokeWidth={3.25} />
              </div>
              <h1 className="font-brand text-xl">zzzeit</h1>
            </div>
          </Link>
          <div className="flex gap-2 pr-3 lg:hidden">
            <ThemeToggle
              variant="ghost"
              className="size-9 transition-shadow hover:bg-transparent focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-9 transition-shadow hover:bg-transparent focus-visible:ring-offset-0"
              onClick={async () => await signOut(auth)}
            >
              <LogOutIcon className="size-5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </header>
      <div className="mt-safe-top h-14 w-full" />
    </>
  );
}
