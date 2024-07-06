import Layout from "@/components/layout/Layout";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <Layout>
      <div>Hello /!</div>
    </Layout>
  ),
});
