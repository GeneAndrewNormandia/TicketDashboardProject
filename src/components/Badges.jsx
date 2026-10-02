import { PRIORITY_ORDER, slug } from "../utils/tickets";

export function StatusBadge({ status }) {
  return (
    <span className={`badge status status-${slug(status)}`}>
      <span className="dot" aria-hidden="true" />
      {status}
    </span>
  );
}

// Three small bars: High = 3 filled, Medium = 2, Low = 1. Shape carries the meaning, not just colour.
export function PriorityBadge({ priority }) {
  if (!priority) {
    return <span className="badge priority priority-none">No priority</span>;
  }
  const rank = PRIORITY_ORDER.indexOf(priority);
  const filled = rank === -1 ? 0 : 3 - rank;
  return (
    <span className={`badge priority priority-${slug(priority)}`}>
      <span className="bars" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <i key={n} className={n <= filled ? "on" : ""} />
        ))}
      </span>
      {priority}
    </span>
  );
}
