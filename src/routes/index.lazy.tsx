import Tracker from "@/components/tracker";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Tracker,
});
