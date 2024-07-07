import {
  CollectionReference,
  onSnapshot as onFirebaseSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { DependencyList, useEffect, useState } from "react";

export default function useCollectionSnapshot<T>({
  ref,
  key,
  onSnapshot,
}: {
  ref: CollectionReference<T> | Query<T>;
  key: DependencyList;
  onSnapshot?: (data: T[]) => void;
}) {
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onFirebaseSnapshot(
      ref,
      (snapshot: QuerySnapshot<T>) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
        onSnapshot?.(newData);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, key);

  return { data, isLoading };
}
