import { Project } from "@/lib/types";

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      <h2 className="h1 standalone:hidden">{project.name}</h2>
    </div>
  );
}
