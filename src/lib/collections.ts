export const Collection = {
  Projects: "projects",
  Trackers: "trackers",
} as const;
export type Collection = (typeof Collection)[keyof typeof Collection];

const SubCollection = {
  WeekLogs: "logs",
} as const;
type SubCollection = (typeof SubCollection)[keyof typeof SubCollection];

export function getWeekLogsPath(projectId: string, week?: string) {
  return `${Collection.Projects}/${projectId}/${SubCollection.WeekLogs}${week ? `/${week}` : ""}`;
}
