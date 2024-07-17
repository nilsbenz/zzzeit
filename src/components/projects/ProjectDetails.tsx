import { getWeekLogsPath } from "@/lib/collections";
import { weekLogsConverter } from "@/lib/converters";
import { db } from "@/lib/firebase";
import useDocumentSnapshot from "@/lib/hooks/useDocumentSnapshot";
import useIsStandalone from "@/lib/hooks/useIsStandalone";
import { removeLog } from "@/lib/logs";
import { Log, Project, WeekLogs } from "@/lib/types";
import {
  cn,
  getCalendarWeek,
  getDuration,
  getMondayOfCalendarWeek,
} from "@/lib/utils";
import { addDays, addWeeks, formatDate, isSameDay, isWeekend } from "date-fns";
import { doc } from "firebase/firestore";
import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

function WeekSwitcher({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  function handleChangeWeek(delta: number) {
    const newDate = addWeeks(getMondayOfCalendarWeek(value), delta);
    onValueChange(formatDate(newDate, "yyyy-II"));
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChangeWeek(-1)}
      >
        <ChevronLeftIcon />
      </Button>
      <h3 className="h2">
        {formatDate(getMondayOfCalendarWeek(value), "MMMM")}
      </h3>
      <Button
        variant="outline"
        size="icon"
        className="justify-self-end"
        onClick={() => handleChangeWeek(1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

function DayLogsListItem({ project, log }: { project: Project; log: Log }) {
  async function handleDelete() {
    await removeLog(project.id, log);
  }

  return (
    <div key={log.id} className="flex items-center justify-between px-3 py-2">
      <div>
        <p className="font-semibold">
          {formatDate(log.start, "HH:MM")} - {formatDate(log.end, "HH:MM")}
        </p>
        <p className="text-muted-foreground">
          {Number(((log.end - log.start) / (1000 * 60 * 60)).toFixed(1))} Hours
        </p>
      </div>
      <Button variant="outline" size="icon" onClick={handleDelete}>
        <Trash2Icon strokeWidth={2.25} />
      </Button>
    </div>
  );
}

function CalendarDay({
  project,
  date,
  logs,
}: {
  project: Project;
  date: Date;
  logs: WeekLogs | null | undefined;
}) {
  const dayLogs = logs?.logs.filter((l) => isSameDay(date, l.start));

  const PADDING_START = 5;
  const PADDING_END = 2;

  function getOffset(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutesInDay = (24 - PADDING_START - PADDING_END) * 60;
    const minutesPassed = (hours - PADDING_START) * 60 + minutes;
    return `${(minutesPassed / totalMinutesInDay) * 100}%`;
  }

  function getHeight(log: Log) {
    const totalMinutesInDay = (24 - PADDING_START - PADDING_END) * 60;
    const duration = (log.end - log.start) / (1000 * 60);
    return `${(duration / totalMinutesInDay) * 100}%`;
  }

  return (
    <div
      className={cn(
        "group flex flex-col gap-2 py-2 [&:not(:first-child)]:border-l [&:not(:last-child)]:border-r",
        isWeekend(date) && "border-background bg-border"
      )}
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant={isSameDay(date, new Date()) ? "default" : "ghost"}
            className={"z-10 mx-0.5 h-fit flex-col gap-0.5"}
          >
            <span className="text-xl font-extrabold sm:text-2xl">
              {formatDate(date, "d")}
            </span>
            {dayLogs && (
              <span>
                {Number(
                  (
                    dayLogs.reduce((acc, curr) => acc + getDuration(curr), 0) /
                    60
                  ).toFixed(1)
                )}
                h
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col">
            <DrawerHeader>
              <DrawerTitle>
                Logs from {formatDate(date, "MMMM dd, yyyy")}
              </DrawerTitle>
            </DrawerHeader>
            <div className="grow divide-y-2 p-4">
              {dayLogs?.map((log) => (
                <DayLogsListItem key={log.id} project={project} log={log} />
              ))}
              {(!dayLogs || dayLogs.length === 0) && <p>No logs yet.</p>}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {dayLogs && (
        <div className="relative grow">
          {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map(
            (time) => (
              <div
                key={time}
                className={cn(
                  "pointer-events-none absolute left-0 right-0 flex h-0.5 items-center justify-center",
                  isWeekend(date) ? "bg-background" : "bg-border"
                )}
                style={{ top: getOffset(time) }}
              >
                <span
                  className={cn(
                    "z-10 hidden rounded px-0.5 text-sm font-medium group-first:inline group-last:inline",
                    isWeekend(date) ? "bg-background" : "bg-border"
                  )}
                >
                  {time}
                </span>
              </div>
            )
          )}
          {dayLogs.map((log) => (
            <Button
              key={log.id}
              variant="outline"
              className="absolute left-0.5 right-0.5 cursor-default border-primary/20 bg-primary/40 backdrop-blur-[3px] hover:bg-primary/50"
              style={{
                top: getOffset(formatDate(log.start, "HH:MM")),
                height: getHeight(log),
              }}
              tabIndex={-1}
            />
          ))}
          {isSameDay(date, new Date()) && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-primary"
              style={{ top: getOffset(formatDate(new Date(), "HH:MM")) }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
}

function Calendar({
  project,
  week,
  logs,
}: {
  project: Project;
  week: string;
  logs: WeekLogs | null | undefined;
}) {
  const monday = getMondayOfCalendarWeek(week);

  return (
    <div className="grid min-h-[400px] grow grid-cols-7">
      {new Array(7).fill(null).map((_, i) => (
        <CalendarDay
          key={formatDate(addDays(monday, i), "yyyy-MM-dd")}
          project={project}
          date={addDays(monday, i)}
          logs={logs}
        />
      ))}
    </div>
  );
}

export default function ProjectDetails({ project }: { project: Project }) {
  const [selectedWeek, setSelectedWeek] = useState(getCalendarWeek(new Date()));
  const isStandalone = useIsStandalone();

  const { data: weekLogs } = useDocumentSnapshot(
    doc(db, getWeekLogsPath(project.id, selectedWeek)).withConverter(
      weekLogsConverter
    )
  );

  return (
    <div className="flex h-full flex-col gap-6">
      {!isStandalone && (
        <h2 className="h1 standalone:hidden">{project.name}</h2>
      )}
      <WeekSwitcher value={selectedWeek} onValueChange={setSelectedWeek} />
      <Calendar project={project} week={selectedWeek} logs={weekLogs} />
    </div>
  );
}
