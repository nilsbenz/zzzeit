import { projectsAtom } from "@/lib/atoms";
import { Collection } from "@/lib/collections";
import { projectConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import { Log, Tracker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import {
  arrayUnion,
  deleteDoc,
  doc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { useAtomValue } from "jotai";
import {
  PauseIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInterval } from "usehooks-ts";
import * as z from "zod";
import NewProjectForm from "../projects/NewProjectForm";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getDuration(tracker: Tracker) {
  return Math.max(
    0,
    Math.ceil(
      ((tracker.end ?? new Date().getTime()) - tracker.start) / (1000 * 60)
    )
  );
}

const FormSchema = z.object({
  start: z.string(),
  end: z.string(),
  project: z.string(),
  comment: z.string().optional(),
});

export default function TrackerCard({ tracker }: { tracker: Tracker }) {
  const dbRef = doc(db, Collection.Trackers, tracker.id);

  const [openComment, setOpenComment] = useState(!!tracker.comment);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      start: formatDate(new Date(tracker.start)),
      end: tracker.end ? formatDate(new Date(tracker.end)) : undefined,
      project: tracker.project ?? undefined,
      comment: tracker.comment,
    },
  });
  const [formState, setFormState] = useState<"idle" | "busy">("idle");
  const [openNewProject, setOpenNewProject] = useState(false);
  const [minutesSinceStart, setMinutesSinceStart] = useState(
    getDuration(tracker)
  );
  const projects = useAtomValue(projectsAtom);

  async function handleRemove() {
    await deleteDoc(dbRef);
  }

  async function handleChange(tracker: Partial<Tracker>) {
    try {
      await updateDoc(dbRef, tracker);
    } catch (e) {
      if ((e as FirebaseError).code !== "not-found") {
        console.error(e);
      }
    }
  }

  async function handleStopClicked() {
    const now = new Date();
    form.setValue("end", formatDate(now));
    await handleChange({ end: now.getTime() });
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setFormState("busy");
      const log: Log = {
        type: "report",
        id: tracker.id,
        start: new Date(data.start).getTime(),
        end: new Date(data.end).getTime(),
        comment: data.comment ?? "",
      };
      const duration = Math.ceil((log.end - log.start) / (1000 * 60));
      if (duration < 0) {
        form.setError("end", { message: "The end must be after the start." });
        return;
      }
      await runTransaction(db, async (transaction) => {
        const projectRef = doc(
          db,
          Collection.Projects,
          data.project
        ).withConverter(projectConverter);
        const projectSnapshot = await transaction.get(projectRef);
        if (!projectSnapshot.exists()) {
          console.log("error whilst saving. project undefined.");
          return;
        }
        const project = projectSnapshot.data()!;
        const timeBalance = project.timeBalance + duration;
        transaction.update(projectRef, {
          recentLogs: arrayUnion(log),
          timeBalance,
        });
        transaction.delete(dbRef);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setFormState("idle");
    }
  }

  useInterval(
    () => {
      setMinutesSinceStart(getDuration(tracker));
    },
    tracker.end ? null : 1000
  );

  useEffect(() => {
    form.reset({
      start: formatDate(new Date(tracker.start)),
      end: tracker.end ? formatDate(new Date(tracker.end)) : undefined,
      project: tracker.project ?? undefined,
      comment: tracker.comment,
    });
    setOpenComment((prev) => prev || !!tracker.comment);
    setMinutesSinceStart(getDuration(tracker));
  }, [tracker]);

  useEffect(() => {
    if (projects && projects.length === 1) {
      form.setValue("project", projects[0].id);
      handleChange({ project: projects[0].id });
    }
  }, [projects]);

  return (
    <>
      <Card className="relative isolate">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="pb-0">
              <div className="flex flex-wrap items-start justify-between gap-x-2">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={`start-${tracker.id}`}>
                        Start
                      </FormLabel>
                      <Input
                        type="datetime-local"
                        id={`start-${tracker.id}`}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={(e) => {
                          field.onBlur();
                          handleChange({
                            start: new Date(e.currentTarget.value).getTime(),
                          });
                        }}
                        className="w-fit bg-background/20 py-0 text-lg font-semibold backdrop-blur-sm"
                      />
                    </FormItem>
                  )}
                />
                {tracker.end && (
                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem className="ml-auto">
                        <div className="text-right">
                          <FormLabel htmlFor={`end-${tracker.id}`}>
                            End
                          </FormLabel>
                        </div>
                        <Input
                          type="datetime-local"
                          id={`end-${tracker.id}`}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={(e) => {
                            field.onBlur();
                            handleChange({
                              end: new Date(e.currentTarget.value).getTime(),
                            });
                          }}
                          className="ml-auto w-fit bg-background/20 py-0 text-lg font-semibold backdrop-blur-sm"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 py-3">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="comment">Project</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          handleChange({ project: v });
                        }}
                        disabled={!projects || projects.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects ? (
                            projects.length > 0 ? (
                              projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))
                            ) : (
                              <p className="px-2 py-1 text-sm text-muted-foreground">
                                Please create a project first.
                              </p>
                            )
                          ) : (
                            <p className="px-2 py-1 text-sm text-muted-foreground">
                              Loading...
                            </p>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={
                          projects && projects.length == 0
                            ? "default"
                            : "outline"
                        }
                        type="button"
                        onClick={() => setOpenNewProject(true)}
                      >
                        New <PlusIcon strokeWidth={2.25} />
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className={cn(!openComment && "hidden")}>
                    <FormLabel htmlFor="comment">Comment</FormLabel>
                    <Textarea
                      id="comment"
                      defaultValue={field.value}
                      onBlur={(e) => {
                        field.onBlur();
                        handleChange({
                          comment: e.currentTarget.value,
                        });
                      }}
                    />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemove}
                type="button"
              >
                <Trash2Icon strokeWidth={2.25} />
              </Button>
              <div className="flex gap-2">
                {!openComment && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenComment(true)}
                  >
                    <PencilIcon strokeWidth={2.25} />
                  </Button>
                )}
                {tracker.end ? (
                  <Button type="submit" disabled={formState === "busy"}>
                    Save <SaveIcon strokeWidth={2.25} />
                  </Button>
                ) : (
                  <Button onClick={handleStopClicked} type="button">
                    Stop <PauseIcon strokeWidth={2.25} />
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
        <p className="absolute right-2 top-2 -z-10 font-mono text-6xl font-extrabold text-foreground/25">
          {String(Math.floor(minutesSinceStart / 60)).padStart(2, "0")}
          <span className={cn(!tracker.end && "animate-pulse")}>:</span>
          {String(minutesSinceStart % 60).padStart(2, "0")}
        </p>
      </Card>
      <NewProjectForm
        dialogOnly
        open={openNewProject}
        onOpenChange={setOpenNewProject}
      />
    </>
  );
}
