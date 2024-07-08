export const Currency = {
  SwissFranc: "chf",
  Euro: "eur",
  Dollar: "usd",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export type Log =
  | {
      type: "report";
      id: string;
      start: number;
      end: number;
      comment: string;
    }
  | {
      type: "bill";
      id: string;
      date: string;
      amount: number;
      currency: Currency;
      billedTime: number;
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
  billedAmount: number;
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
