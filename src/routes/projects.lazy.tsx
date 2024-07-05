import Projects from "@/components/projects";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/projects")({
  component: Projects,
});
