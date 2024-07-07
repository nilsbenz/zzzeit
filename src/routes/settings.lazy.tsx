import Layout from "@/components/layout/Layout";
import Settings from "@/components/settings";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: () => (
    <Layout title="Settings">
      <Settings />
    </Layout>
  ),
});
