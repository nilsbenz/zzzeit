import { trackersAtom } from "@/lib/atoms";
import { Collection } from "@/lib/collections";
import { useAuthContext } from "@/lib/context/auth";
import { trackerConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { PlusIcon } from "lucide-react";
import Loading from "../common/Loading";
import { Button } from "../ui/button";
import TrackerCard from "./TrackerCard";

export default function Tracker() {
  const trackers = useAtomValue(trackersAtom);
  const { user } = useAuthContext();

  async function handleAddTracker() {
    await addDoc(
      collection(db, Collection.Trackers).withConverter(trackerConverter),
      {
        id: "",
        userId: user.uid,
        project: null,
        start: new Date().getTime(),
        end: null,
        comment: "",
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="standalone:hidden flex items-center justify-between">
        <h2 className="h1">Tracker</h2>
        {trackers && trackers.length > 0 && (
          <Button size="sm" onClick={handleAddTracker}>
            Add <PlusIcon strokeWidth={2.5} />
          </Button>
        )}
      </div>
      {trackers ? (
        trackers.length > 0 ? (
          <div className="space-y-4">
            {trackers.map((tracker) => (
              <TrackerCard key={tracker.id} tracker={tracker} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Button
              onClick={handleAddTracker}
              className="h-fit w-full max-w-60 flex-col items-center"
            >
              <PlusIcon className="!size-8" strokeWidth={2.25} />
              <span className="text-lg">Add Tracker</span>
            </Button>
          </div>
        )
      ) : (
        <div className="flex h-40 items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
}
