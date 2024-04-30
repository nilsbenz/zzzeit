import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <>
      <header className="pl-safe-left pr-safe-right pt-safe-top fixed left-0 right-0 top-0 z-50 border-b-2 bg-background/80 backdrop-blur-sm">
        <div className="-mb-0.5 flex h-14 items-center gap-2">
          <Link
            to="/"
            className="ml-2 h-9 rounded-md px-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-full items-center gap-3">
              <img
                src="/logo.svg"
                alt=""
                className="animate-hourglass size-6 scale-90"
              />
              <h1 className="text-xl font-bold tracking-wide">zzzeit</h1>
            </div>
          </Link>
        </div>
      </header>
      <div className="mt-safe-top h-14 w-full" />
    </>
  );
}
