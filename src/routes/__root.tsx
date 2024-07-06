import { AuthContextProvider } from "@/lib/context/auth";
import useDarkMode from "@/lib/hooks/useDarkMode";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools = ["production", "development"].includes(
  process.env.NODE_ENV ?? ""
)
  ? () => null
  : React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    );

function Root() {
  useDarkMode();

  return (
    <AuthContextProvider>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position="bottom-left" />
      </Suspense>
    </AuthContextProvider>
  );
}

export const Route = createRootRoute({
  component: Root,
});
