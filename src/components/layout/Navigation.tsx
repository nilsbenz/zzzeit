import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CalendarDaysIcon,
  ListIcon,
  LucideIcon,
  TimerIcon,
} from "lucide-react";

type NavElement = {
  path: string;
  text: string;
  icon: LucideIcon;
};

const navElements = [
  { path: "/", text: "Tracker", icon: TimerIcon },
  { path: "/logs", text: "Logs", icon: CalendarDaysIcon },
  { path: "/projects", text: "Projects", icon: ListIcon },
];

function NavigationElement({ element }: { element: NavElement }) {
  return (
    <li className="px-3 sm:px-2.5 sm:py-1">
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
      <nav
        className={cn(
          "pb-safe-bottom fixed bottom-0 left-0 right-0 top-auto z-30 border-t-2 bg-background/80 pl-[calc(env(safe-area-inset-left,_0px)_+_1rem)] pr-[calc(env(safe-area-inset-right,_0px)_+_1rem)] backdrop-blur",
          "sm:pl-safe-left sm:right-auto sm:top-14 sm:z-auto sm:border-r-2 sm:border-t-0 sm:pr-0 sm:pt-[calc(env(safe-area-inset-top,_0px)_+_1rem)]"
        )}
      >
        <ul className="mx-auto grid h-[--nav-height] max-w-sm auto-cols-fr grid-flow-col items-center sm:w-24 sm:grid-flow-row lg:w-48 lg:gap-y-0.5 lg:pt-6">
          {navElements.map((e) => (
            <NavigationElement element={e} key={e.path} />
          ))}
        </ul>
      </nav>
      <div className="mb-safe-bottom h-[--nav-height] w-full sm:h-px sm:max-w-[6rem] lg:max-w-[12rem]" />
    </>
  );
}
