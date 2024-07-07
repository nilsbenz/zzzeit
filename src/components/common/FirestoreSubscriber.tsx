import { projectsAtom, trackersAtom } from "@/lib/atoms";
import { Collection } from "@/lib/collections";
import { useAuthContext } from "@/lib/context/auth";
import { projectConverter, trackerConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import useCollectionSnapshot from "@/lib/hooks/useCollectionSnapshot";
import { ReactNode } from "@tanstack/react-router";
import { collection, query, where } from "firebase/firestore";
import { useSetAtom } from "jotai";

export default function FirestoreSubscriber({
  children,
}: {
  children?: ReactNode;
}) {
  const { user } = useAuthContext();
  const setProjects = useSetAtom(projectsAtom);
  const setTrackers = useSetAtom(trackersAtom);

  useCollectionSnapshot({
    ref: query(
      collection(db, Collection.Projects).withConverter(projectConverter),
      where("userId", "==", user.uid)
    ),
    key: ["projects", user.uid],
    onSnapshot: (ps) =>
      setProjects(ps.sort((a, b) => (a.name < b.name ? -1 : 1))),
  });
  useCollectionSnapshot({
    ref: query(
      collection(db, Collection.Trackers).withConverter(trackerConverter),
      where("userId", "==", user.uid)
    ),
    key: ["trackers", user.uid],
    onSnapshot: (ts) =>
      setTrackers(ts.sort((a, b) => (a.start < b.start ? -1 : 1))),
  });

  return <>{children}</>;
}
