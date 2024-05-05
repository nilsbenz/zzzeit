import Auth from "@/components/auth/Auth";
import Layout from "@/components/layout/Layout";
import SplashScreen from "@/components/layout/SplashScreen";
import useDarkMode from "@/lib/hooks/useDarkMode";
import useUser from "@/lib/hooks/useUser";
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

export const Route = createRootRoute({
  component: () => {
    useDarkMode();

    const { user, isLoading } = useUser();

    if (isLoading) {
      return <SplashScreen />;
    }

    if (!user) {
      return <Auth />;
    }

    return (
      <Layout>
        <Outlet />
        <Suspense>
          <TanStackRouterDevtools position="bottom-left" />
        </Suspense>
      </Layout>
    );
  },
});
