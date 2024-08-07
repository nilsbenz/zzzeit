import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Project, Tracker, WeekLogs } from "./types";

type Db<T> = Omit<T, "id">;

function createSimpleConverter<
  T extends { id: string },
>(): FirestoreDataConverter<T, Db<T>> {
  return {
    toFirestore: (event: T): Db<T> => {
      const res: Db<T> & { id?: string } = { ...event };
      delete res.id;
      return res;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      const data = snapshot.data();
      return { id: snapshot.id, ...data } as T;
    },
  };
}

export const projectConverter = createSimpleConverter<Project>();
export const weekLogsConverter = createSimpleConverter<WeekLogs>();
export const trackerConverter = createSimpleConverter<Tracker>();
