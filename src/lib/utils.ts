import { type ClassValue, clsx } from "clsx";
import { formatDate, parse } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Log, Tracker } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDuration(item: Tracker | Log) {
  return Math.max(
    0,
    Math.ceil(((item.end ?? new Date().getTime()) - item.start) / (1000 * 60))
  );
}

export function getCalendarWeek(date?: string | number | Date) {
  return formatDate(date ?? new Date(), "yyyy-II");
}

export function getMondayOfCalendarWeek(week: string) {
  return parse(
    week.split("-")[1],
    "II",
    new Date(`${week.split("-")[0]}-01-31`)
  );
}
