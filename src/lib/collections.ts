export const Collection = {
  Trackers: "trackers",
  Projects: "projects",
  LogBlocks: "log-blocks",
} as const;
export type Collection = (typeof Collection)[keyof typeof Collection];
