import Layout from "@/components/layout/Layout";
import Projects from "@/components/projects";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/projects")({
  component: () => (
    <Layout>
      <Projects />
    </Layout>
  ),
});
