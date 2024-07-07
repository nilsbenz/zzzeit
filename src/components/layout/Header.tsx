import useIsStandalone from "@/lib/hooks/useIsStandalone";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  HourglassIcon,
  LucideIcon,
  Settings2Icon,
} from "lucide-react";
import { Button, ButtonProps, buttonVariants } from "../ui/button";

export type HeaderAction = {
  icon: LucideIcon;
  variant: ButtonProps["variant"];
  onClick: () => void;
};

export default function Header({
  title,
  backButton,
  actions,
}: {
  title?: string;
  backButton?: boolean;
  actions?: HeaderAction[];
}) {
  const router = useRouter();
  const isStandalone = useIsStandalone();

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b-2 bg-background/80 pl-safe-left pr-safe-right pt-safe-top backdrop-blur-sm">
        <div className="-mb-0.5 flex h-14 items-center justify-between gap-2">
          <Link
            to={isStandalone ? "#" : "/"}
            tabIndex={isStandalone ? -1 : undefined}
            onClick={(e) => {
              if (isStandalone) {
                e.preventDefault();
              }
            }}
            className="ml-2 h-9 truncate rounded-md px-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-full items-center gap-1.5 lg:gap-3">
              {isStandalone && backButton ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mx-1 w-8 shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    router.history.back();
                  }}
                >
                  <ChevronLeftIcon strokeWidth={3.5} />
                </Button>
              ) : (
                <div className="shrink-0 animate-hourglass">
                  <HourglassIcon
                    className="size-6 scale-90"
                    strokeWidth={3.25}
                  />
                </div>
              )}
              {isStandalone && title ? (
                <h1 className="truncate text-xl font-semibold">{title}</h1>
              ) : (
                <h1 className="font-brand text-xl">zzzeit</h1>
              )}
            </div>
          </Link>
          {actions && (
            <div className="standalone:flex hidden gap-2 pr-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="icon"
                  className="size-9"
                  onClick={action.onClick}
                >
                  <action.icon className="size-5" strokeWidth={2.5} />
                </Button>
              ))}
            </div>
          )}
          <Link
            to="/settings"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "standalone:hidden mr-3 size-9 transition-shadow hover:bg-transparent focus-visible:ring-offset-0"
            )}
          >
            <Settings2Icon className="size-6" strokeWidth={2.5} />
          </Link>
        </div>
      </header>
      <div className="mt-safe-top h-14 w-full" />
    </>
  );
}
