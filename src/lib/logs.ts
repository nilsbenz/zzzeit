import {
  arrayRemove,
  arrayUnion,
  doc,
  runTransaction,
} from "firebase/firestore";
import { Collection, getWeekLogsPath } from "./collections";
import { projectConverter, weekLogsConverter } from "./converters";
import { db } from "./firebase";
import { Log } from "./types";
import { getCalendarWeek, getDuration } from "./utils";

export async function addLog(projectId: string, log: Log, trackerId?: string) {
  const duration = Math.ceil((log.end - log.start) / (1000 * 60));
  const projectRef = doc(db, Collection.Projects, projectId).withConverter(
    projectConverter
  );
  const week = getCalendarWeek(log.start);
  const weekLogsRef = doc(db, getWeekLogsPath(projectId, week)).withConverter(
    weekLogsConverter
  );

  await runTransaction(db, async (transaction) => {
    const [projectSnapshot, weekLogsSnapshot] = await Promise.all([
      transaction.get(projectRef),
      transaction.get(weekLogsRef),
    ]);
    if (!projectSnapshot.exists()) {
      console.log("error whilst saving. project undefined.");
      return;
    }
    const project = projectSnapshot.data()!;
    const timeBalance = project.timeBalance + duration;
    transaction.update(projectRef, { timeBalance });
    if (weekLogsSnapshot.exists()) {
      transaction.update(weekLogsRef, { logs: arrayUnion(log) });
    } else {
      transaction.set(weekLogsRef, {
        id: weekLogsRef.path.split("/").pop() ?? week,
        logs: [log],
      });
    }
    if (trackerId) {
      const trackerRef = doc(db, Collection.Trackers, trackerId);
      transaction.delete(trackerRef);
    }
  });
}

export async function removeLog(projectId: string, log: Log) {
  const duration = getDuration(log);
  const projectRef = doc(db, Collection.Projects, projectId).withConverter(
    projectConverter
  );
  const weekLogsRef = doc(
    db,
    getWeekLogsPath(projectId, getCalendarWeek(log.start))
  ).withConverter(weekLogsConverter);
  await runTransaction(db, async (transaction) => {
    const projectSnapshot = await transaction.get(projectRef);
    if (!projectSnapshot.exists()) {
      console.log("error whilst saving. project undefined.");
      return;
    }
    const project = projectSnapshot.data()!;
    const timeBalance = project.timeBalance - duration;

    transaction.update(projectRef, { timeBalance });
    transaction.update(weekLogsRef, { logs: arrayRemove(log) });
  });
}
