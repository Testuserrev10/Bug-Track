export type BugStatus = "Open" | "In Progress" | "Blocked" | "Resolved" | "Closed";
export type BugSeverity = "P0 · Critical" | "P1 · High" | "P2 · Medium" | "P3 · Low";
export type BugPriority = "Urgent" | "High" | "Medium" | "Low";
export type BugArea = "FE" | "BE" | "Both";

export type Bug = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expected: string;
  actual: string;
  severity: BugSeverity;
  priority: BugPriority;
  area: BugArea;
  status: BugStatus;
  assignee: string;
  reporter: string;
  tags: string[];
  environment: string;
  browser: string;
  release: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  age: number;
  activity: { text: string; time: string; initials: string }[];
};

export const people = [
  { name: "You", initials: "YU", color: "#d7ff66" },
  { name: "Maya Chen", initials: "MC", color: "#b5a6ff" },
  { name: "Ravi Patel", initials: "RP", color: "#ffc680" },
  { name: "Sofia Kim", initials: "SK", color: "#70e1d4" },
  { name: "Noah Williams", initials: "NW", color: "#ff91a8" },
  { name: "Elena Rossi", initials: "ER", color: "#7eb6ff" },
];

const titles = [
  "Checkout session loops after applying a saved card",
  "Blank state flashes before project activity loads",
  "Webhook retries ignore exponential backoff",
  "Keyboard focus disappears inside filter popover",
  "Invite email shows stale workspace name",
  "CSV export drops rows with unicode characters",
  "Mobile nav overlaps the release selector",
  "Sentry breadcrumbs missing for failed mutations",
  "Avatar fallback renders as broken image on Safari",
  "Bulk status update times out for large workspaces",
  "Timezone offset shifts due dates by one day",
  "Search index does not match archived issue tags",
  "Permission error is swallowed on report export",
  "Toast stack pushes content below the fold",
  "Dark mode chart labels fail contrast in compact view",
  "Duplicate detector misses near-identical titles",
  "Pagination resets when changing assignee",
  "Webhook signature fails for empty body payload",
  "Release badge is missing on related bug cards",
  "Screen reader skips the bug severity label",
];

const descriptions = [
  "Observed during the release candidate smoke pass. The happy path works once, then becomes inconsistent after returning from a nested flow.",
  "This is reproducible in a clean workspace and appears tied to the transition between cached and fresh data.",
  "The issue is most visible under realistic team activity and creates uncertainty during final verification.",
  "A regression from the latest release candidate. The UI recovers after a hard refresh, but the first interaction is misleading.",
];
const releases = ["v2.8.0 · Horizon", "v2.7.4 · Nightfall", "v2.9.0 · Canary", "v2.6.3 · Atlas"];
const environments = ["Production", "Staging", "Preview", "Local"];
const browsers = ["Chrome 128 / macOS", "Safari 17 / iOS", "Firefox 129 / Windows", "Edge 128 / Windows"];
const tags = ["release-blocker", "regression", "payments", "accessibility", "performance", "observability", "mobile", "data-integrity", "api", "ux"];
const severities: BugSeverity[] = ["P0 · Critical", "P1 · High", "P2 · Medium", "P3 · Low"];
const priorities: BugPriority[] = ["Urgent", "High", "Medium", "Low"];
const areas: BugArea[] = ["FE", "BE", "Both"];
const statuses: BugStatus[] = ["Open", "In Progress", "Blocked", "Resolved", "Closed"];

export function seedBugs(): Bug[] {
  return Array.from({ length: 60 }, (_, index) => {
    const severity = severities[index % severities.length];
    const status = statuses[(index * 3) % statuses.length];
    const createdDaysAgo = 1 + ((index * 7) % 41);
    const date = new Date(Date.now() - createdDaysAgo * 86400000);
    const assignee = people[(index + 1) % people.length].name;
    return {
      id: `BUG-${String(1842 - index).padStart(4, "0")}`,
      title: titles[index % titles.length],
      description: descriptions[index % descriptions.length],
      steps: ["Open the affected workspace", "Repeat the flow from the release checklist", "Observe the inconsistent result"],
      expected: "The workflow should complete once with a clear success state and preserve the selected context.",
      actual: "The interface briefly shows a stale or empty result before resolving, leaving the tester unsure whether the action completed.",
      severity,
      priority: priorities[(index + 1) % priorities.length],
      area: areas[(index + 2) % areas.length],
      status,
      assignee,
      reporter: people[(index + 3) % people.length].name,
      tags: [tags[index % tags.length], tags[(index + 3) % tags.length]],
      environment: environments[index % environments.length],
      browser: browsers[index % browsers.length],
      release: releases[index % releases.length],
      dueDate: new Date(Date.now() + ((index % 9) - 3) * 86400000).toISOString(),
      createdAt: date.toISOString(),
      updatedAt: new Date(date.getTime() + 3 * 86400000).toISOString(),
      age: createdDaysAgo,
      activity: [
        { text: `Assigned to ${assignee}`, time: `${Math.max(1, index % 12)}h ago`, initials: people[(index + 1) % people.length].initials },
        { text: "Added to release triage", time: `${createdDaysAgo}d ago`, initials: "YU" },
      ],
    };
  });
}

export const areaColors: Record<BugArea, string> = { FE: "#d7ff66", BE: "#b5a6ff", Both: "#70e1d4" };
export const severityColors: Record<BugSeverity, string> = { "P0 · Critical": "#ff6b7a", "P1 · High": "#ffb86b", "P2 · Medium": "#d7ff66", "P3 · Low": "#8b98a9" };
