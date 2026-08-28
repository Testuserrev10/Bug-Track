export type BugStatus = "Open" | "In Progress" | "Blocked" | "Resolved" | "Closed";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type Area = "FE" | "BE" | "Both";

export type Person = { name: string; role: string; initials: string; color: string };

export type Bug = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expected: string;
  actual: string;
  severity: Severity;
  priority: Priority;
  area: Area;
  status: BugStatus;
  assignee: Person;
  reporter: Person;
  tags: string[];
  environment: string;
  browser: string;
  release: string;
  dueDate: string;
  createdAt: string;
  resolvedAt?: string;
  comments: { id: string; author: Person; body: string; createdAt: string }[];
  activity: { id: string; text: string; actor: Person; createdAt: string; kind: "created" | "updated" | "comment" | "moved" }[];
  relatedIds: string[];
  duplicateOf?: string;
};

export type View = "overview" | "explorer" | "kanban" | "my-work" | "reports";
