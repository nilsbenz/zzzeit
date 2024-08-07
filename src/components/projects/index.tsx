import { projectsAtom } from "@/lib/atoms";
import useIsStandalone from "@/lib/hooks/useIsStandalone";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ChevronRightIcon } from "lucide-react";
import Loading from "../common/Loading";
import { buttonVariants } from "../ui/button";
import NewProjectForm from "./NewProjectForm";

export default function Projects() {
  const projects = useAtomValue(projectsAtom);
  const isStandalone = useIsStandalone();

  return (
    <div className="space-y-6">
      {!isStandalone && (
        <div className="flex items-center justify-between">
          <h2 className="h1">Projects</h2>
          <NewProjectForm />
        </div>
      )}
      <div className="divide-y-2">
        {projects ? (
          projects.map((project) => (
            <div key={project.id} className="-mx-3 py-1">
              <Link
                to={"/projects/$projectId"}
                params={{ projectId: project.id }}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-fit w-full justify-between px-3"
                )}
              >
                <div>
                  <h3 className="h3">{project.name}</h3>
                  <p className="text-muted-foreground">
                    {Number((project.timeBalance / 60).toFixed(1))}{" "}
                    {project.timeBalance === 60 ? "Hour" : "Hours"}
                  </p>
                </div>
                <ChevronRightIcon strokeWidth={3.25} className="size-5" />
              </Link>
            </div>
          ))
        ) : (
          <div className="flex h-40 items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
