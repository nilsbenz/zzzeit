import Layout from "@/components/layout/Layout";
import Projects from "@/components/projects";
import NewProjectForm from "@/components/projects/NewProjectForm";
import { createLazyFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/projects/")({
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const [openNewDialog, setOpenNewDialog] = useState(false);
  return (
    <Layout
      title="Projects"
      headerActions={[
        {
          icon: PlusIcon,
          variant: "default",
          onClick: () => setOpenNewDialog(true),
        },
      ]}
    >
      <Projects />
      <NewProjectForm
        dialogOnly
        open={openNewDialog}
        onOpenChange={setOpenNewDialog}
      />
    </Layout>
  );
}
