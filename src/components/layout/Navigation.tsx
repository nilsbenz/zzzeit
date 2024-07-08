import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import {
  CalendarDaysIcon,
  ListIcon,
  LogOutIcon,
  LucideIcon,
  Settings2Icon,
  TimerIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

type NavElement = {
  path: string;
  text: string;
  icon: LucideIcon;
};

const navElements = [
  { path: "/", text: "Tracker", icon: TimerIcon },
  { path: "/logs", text: "Logs", icon: CalendarDaysIcon },
  { path: "/projects", text: "Projects", icon: ListIcon },
  { path: "/settings", text: "Settings", icon: Settings2Icon },
];

function NavigationElement({ element }: { element: NavElement }) {
  return (
    <li
      className={cn(
        "px-3 sm:px-2.5 sm:py-1",
        ["/settings"].includes(element.path)
          ? "standalone:block hidden"
          : "block"
      )}
    >
      <Link
        to={element.path}
        className="block rounded-sm text-muted-foreground transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:py-1 [&.active]:font-semibold [&.active]:text-foreground"
      >
        {({ isActive }) => (
          <span className="flex flex-col items-center gap-y-[3px] text-sm transition-colors lg:flex-row lg:gap-x-3 lg:pl-1.5 lg:text-base">
            <element.icon
              className="h-6 w-6"
              strokeWidth={isActive ? 2.5 : 2}
            />
            {element.text}
          </span>
        )}
      </Link>
    </li>
  );
}

export function Navigation() {
  return (
    <>
      <aside
        className={cn(
          "fixed bottom-0 left-0 right-0 top-auto z-30 border-t-2 bg-background/80 pb-safe-bottom pl-[calc(env(safe-area-inset-left,_0px)_+_1rem)] pr-[calc(env(safe-area-inset-right,_0px)_+_1rem)] backdrop-blur",
          "sm: flex sm:right-auto sm:top-14 sm:z-auto sm:flex-col sm:border-r-2 sm:border-t-0 sm:pl-safe-left sm:pr-0 sm:pt-[calc(env(safe-area-inset-top,_0px)_+_1rem)]"
        )}
      >
        <nav className="mx-auto max-w-sm grow">
          <ul className="grid h-[--nav-height] auto-cols-fr grid-flow-col items-center sm:w-[--nav-width-sm] sm:grid-flow-row lg:w-[--nav-width-lg] lg:gap-y-0.5 lg:pt-6">
            {navElements.map((e) => (
              <NavigationElement element={e} key={e.path} />
            ))}
          </ul>
        </nav>
        <div className="hidden gap-2 p-4 lg:flex">
          <Button
            variant="outline"
            className="w-full justify-start gap-1.5 px-2"
            onClick={async () => await signOut(auth)}
          >
            <LogOutIcon className="size-5" strokeWidth={2.5} />
            Logout
          </Button>
          <ThemeToggle className="shrink-0" />
        </div>
      </aside>
      <div className="mb-safe-bottom mt-[2px] h-[--nav-height] w-full shrink-0 sm:h-px sm:w-[--nav-width-sm] sm:pl-safe-left lg:w-[--nav-width-lg]" />
    </>
  );
}
