import Loading from "@/components/common/Loading";
import Layout from "@/components/layout/Layout";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { Collection } from "@/lib/collections";
import { projectConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import useDocumentSnapshot from "@/lib/hooks/useDocumentSnapshot";
import { createLazyFileRoute } from "@tanstack/react-router";
import { doc } from "firebase/firestore";

export const Route = createLazyFileRoute("/projects/$projectId")({
  component: ProjectDetailsRoute,
});

function ProjectDetailsRoute() {
  const { projectId } = Route.useParams();

  const { data: project, isLoading } = useDocumentSnapshot(
    doc(db, Collection.Projects, projectId).withConverter(projectConverter)
  );

  return (
    <Layout title={project?.name} backButton>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      ) : project ? (
        <ProjectDetails project={project} />
      ) : (
        <div>
          <p>This project does not exist.</p>
        </div>
      )}
    </Layout>
  );
}
