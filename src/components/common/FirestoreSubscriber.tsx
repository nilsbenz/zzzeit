import { projectsAtom } from "@/lib/atoms";
import { Collection } from "@/lib/collections";
import { projectConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import useCollectionSnapshot from "@/lib/hooks/useCollectionSnapshot";
import { ReactNode } from "@tanstack/react-router";
import { collection } from "firebase/firestore";
import { useSetAtom } from "jotai";

export default function FirestoreSubscriber({
  children,
}: {
  children?: ReactNode;
}) {
  const setProjects = useSetAtom(projectsAtom);

  useCollectionSnapshot(
    collection(db, Collection.Projects).withConverter(projectConverter),
    setProjects
  );

  return <>{children}</>;
}
