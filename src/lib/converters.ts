import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { LogBlock, Project, Tracker } from "./types";

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
export const logBlockConverter = createSimpleConverter<LogBlock>();
export const trackerConverter = createSimpleConverter<Tracker>();
