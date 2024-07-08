import { Collection } from "@/lib/collections";
import { projectConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import { Log, Project } from "@/lib/types";
import {
  arrayRemove,
  doc,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";

function ListItem({
  log,
  parentRef,
}: {
  log: Log;
  parentRef: DocumentReference;
}) {
  async function handleDelete() {
    await updateDoc(parentRef, { recentLogs: arrayRemove(log) });
  }

  if (log.type === "report") {
    return (
      <div key={log.id} className="flex items-center justify-between px-3 py-2">
        <div>
          <p className="font-semibold">
            {`${new Intl.DateTimeFormat(["de-CH", "en-US"], { dateStyle: "short", timeStyle: "short" }).format(log.start)} - ${new Intl.DateTimeFormat(["de-CH", "en-US"], { dateStyle: new Date(log.start).getDate() === new Date(log.end).getDate() ? undefined : "short", timeStyle: "short" }).format(log.end)}`}
          </p>
          <p className="text-muted-foreground">
            {Number(((log.end - log.start) / (1000 * 60 * 60)).toFixed(1))}{" "}
            Hours
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={handleDelete}>
          <Trash2Icon strokeWidth={2.25} />
        </Button>
      </div>
    );
  }

  return null;
}

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <h2 className="h1 standalone:hidden">{project.name}</h2>
      <div className="-mx-3 divide-y-2">
        {project.recentLogs.map((log) => (
          <ListItem
            key={log.id}
            log={log}
            parentRef={doc(db, Collection.Projects, project.id).withConverter(
              projectConverter
            )}
          />
        ))}
      </div>
    </div>
  );
}
