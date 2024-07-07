import {
  CollectionReference,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useCollectionSnapshot<T>(
  ref: CollectionReference<T>,
  callback?: (data: T[]) => void
) {
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snapshot: QuerySnapshot<T>) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
      callback?.(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [ref.path]);

  return { data, isLoading };
}
