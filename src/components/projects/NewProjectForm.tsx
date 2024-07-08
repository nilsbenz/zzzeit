import { Collection } from "@/lib/collections";
import { useAuthContext } from "@/lib/context/auth";
import { projectConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import { Project } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The name must be at least 2 characters long." })
    .trim(),
  slug: z
    .string()
    .min(3, { message: "The slug must be at least 3 characters long." })
    .max(20, { message: "The slug can be at most 20 characters long." })
    .regex(/^\s*[a-zA-Z0-9\-_]{3,20}\s*$/, {
      message: "Please only use letters, - or _.",
    })
    .trim()
    .toLowerCase(),
});

export default function NewProjectForm({
  dialogOnly,
  open,
  onOpenChange,
}:
  | { dialogOnly?: false; open?: never; onOpenChange?: never }
  | {
      dialogOnly: true;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }) {
  const [openDialog, setOpenDialog] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [formState, setFormState] = useState<"idle" | "busy">("idle");
  const { user } = useAuthContext();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setFormState("busy");
      const projectRef = doc(db, Collection.Projects, data.slug).withConverter(
        projectConverter
      );
      if ((await getDoc(projectRef)).exists()) {
        form.setError("slug", {
          message: "This slug is already in use.",
        });
        return;
      }
      const newProject: Project = {
        id: data.slug,
        userId: user.uid,
        name: data.name,
        notes: "",
        timeBalance: 0,
        billedAmount: 0,
        recentLogs: [],
        previousBlock: null,
        createdAt: new Date().getTime(),
      };
      await setDoc(projectRef, newProject);
      form.reset({ name: "", slug: "" });
      handleOpenChange(false);
    } catch (e) {
      console.log(e);
    } finally {
      setFormState("idle");
    }
  }

  function handleOpenChange(open: boolean) {
    setOpenDialog(open);
    onOpenChange?.(open);
    if (!open) {
      form.reset({ name: "", slug: "" });
    }
  }

  return (
    <Dialog open={open ?? openDialog} onOpenChange={handleOpenChange}>
      {!dialogOnly && (
        <DialogTrigger asChild>
          <Button size="sm">
            New <PlusIcon strokeWidth={2.5} />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="projectName">
                    Name of the project
                  </FormLabel>
                  <Input
                    id="projectName"
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="slug">Slug</FormLabel>
                  <Input
                    id="slug"
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={formState === "busy"}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
