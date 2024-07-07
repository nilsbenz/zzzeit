import {
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useDocumentSnapshot<T>(
  ref: DocumentReference<T>,
  callback?: (data: T | null) => void
) {
  const [data, setData] = useState<T | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snapshot: DocumentSnapshot<T>) => {
      const newData = snapshot.data() ?? null;
      setData(newData);
      callback?.(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [ref.path]);

  return { data, isLoading };
}
