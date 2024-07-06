import Layout from "@/components/layout/Layout";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/logs")({
  component: () => (
    <Layout>
      <div>Hello /logs!</div>
    </Layout>
  ),
});
