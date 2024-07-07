import Layout from "@/components/layout/Layout";
import Tracker from "@/components/tracker";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <Layout>
      <Tracker />
    </Layout>
  ),
});
