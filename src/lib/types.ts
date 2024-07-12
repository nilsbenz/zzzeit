export const Currency = {
  SwissFranc: "chf",
  Euro: "eur",
  Dollar: "usd",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export type Log = {
  id: string;
  start: number;
  end: number;
  comment: string;
};

export type Bill = {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  billedHours: number;
  comment: string;
};

export type WeekLogs = {
  id: string;
  logs: Log[];
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  notes: string;
  timeBalance: number;
  bills: Bill[];
  readonly _createdAt: number;
};

export type Tracker = {
  id: string;
  userId: string;
  project: string | null;
  start: number;
  end: number | null;
  comment: string;
};
