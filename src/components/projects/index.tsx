import NewProjectForm from "./NewProjectForm";

export default function Projects() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="h1">Projects</h2>
        <NewProjectForm />
      </div>
    </div>
  );
}
