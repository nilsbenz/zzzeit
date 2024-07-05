export type Log = {
  start: number;
  end: number;
  comment: string;
};

export type LogBlock = {
  id: string;
  project: string;
  userId: string;
  logs: Log[];
  previousBlock: string | null;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  notes: string;
  timeBalance: number;
  recentLogs: Log[];
  previousBlock: string | null;
  createdAt: number;
};

export type Tracker = {
  id: string;
  userId: string;
  project: string | null;
  start: number;
  end: number | null;
  comment: string;
};
