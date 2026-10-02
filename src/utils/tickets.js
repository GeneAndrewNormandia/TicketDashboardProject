// Helpers for cleaning, filtering and sorting ticket data.

export const KNOWN_STATUSES = ["Open", "In Progress", "Closed"];
export const PRIORITY_ORDER = ["High", "Medium", "Low"];

export const NO_STATUS = "No status";
export const NO_CATEGORY = "Uncategorized";

const asText = (value) =>
  typeof value === "string" ? value.trim() : value == null ? "" : String(value);

// "2026-08-20" -> local Date (avoids the UTC off-by-one you get from new Date("2026-08-20")).
export function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(asText(value));
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const raw = asText(value);
  if (!raw) return null;
  const date = parseDate(raw);
  if (!date) return raw; // show unexpected formats as-is instead of hiding them
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Accepts either { "tickets": [...] } or a bare array. Never throws on bad rows.
export function normalizeTickets(raw) {
  const list = Array.isArray(raw)
    ? raw
    : raw && Array.isArray(raw.tickets)
    ? raw.tickets
    : null;

  if (!list) {
    throw new Error('This file does not contain a "tickets" list.');
  }

  return list
    .filter((t) => t && typeof t === "object" && !Array.isArray(t))
    .map((t, index) => {
      const createdAt = asText(t.created_at);
      const dueDate = asText(t.due_date);
      return {
        key: index,
        title: asText(t.title) || "Untitled ticket",
        description: asText(t.description),
        status: asText(t.status) || NO_STATUS,
        priority: asText(t.priority),
        category: asText(t.category) || NO_CATEGORY,
        createdBy: asText(t.created_by),
        assignedTo: asText(t.assigned_to),
        createdAt,
        dueDate,
        createdTs: parseDate(createdAt)?.getTime() ?? null,
        dueTs: parseDate(dueDate)?.getTime() ?? null,
      };
    });
}

export function isOverdue(ticket, now = new Date()) {
  if (ticket.status === "Closed" || ticket.dueTs == null) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return ticket.dueTs < today.getTime();
}

export function slug(value) {
  return asText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "none";
}

// Status chips: the three known statuses first, then anything unexpected found in the data.
export function getStatusOptions(tickets) {
  const extras = [...new Set(tickets.map((t) => t.status))]
    .filter((s) => !KNOWN_STATUSES.includes(s))
    .sort();
  return [...KNOWN_STATUSES, ...extras];
}

export function getCategoryOptions(tickets) {
  return [...new Set(tickets.map((t) => t.category))].sort();
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "due", label: "Due soonest" },
  { value: "priority", label: "Highest priority" },
];

// Missing values always sort to the end.
const byNumber = (a, b, dir = 1) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a - b) * dir;
};

const priorityRank = (p) => {
  const i = PRIORITY_ORDER.indexOf(p);
  return i === -1 ? null : i;
};

export function filterAndSort(tickets, { query, status, category, priority, sort }) {
  const q = query.trim().toLowerCase();

  const filtered = tickets.filter((t) => {
    if (status !== "all" && t.status !== status) return false;
    if (category !== "all" && t.category !== category) return false;
    if (priority !== "all" && t.priority !== priority) return false;
    if (!q) return true;
    return [t.title, t.description, t.createdBy, t.assignedTo, t.category]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return byNumber(a.createdTs, b.createdTs, 1);
      case "due":
        return byNumber(a.dueTs, b.dueTs, 1);
      case "priority":
        return (
          byNumber(priorityRank(a.priority), priorityRank(b.priority), 1) ||
          byNumber(a.createdTs, b.createdTs, -1)
        );
      case "newest":
      default:
        return byNumber(a.createdTs, b.createdTs, -1);
    }
  });
}
