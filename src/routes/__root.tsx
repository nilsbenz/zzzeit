import Layout from "@/components/layout/Layout";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </Layout>
  ),
});
