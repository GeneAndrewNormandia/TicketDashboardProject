import { StatusBadge, PriorityBadge } from "./Badges";
import Field from "./Field";
import { formatDate, isOverdue, slug } from "../utils/tickets";

export default function TicketCard({ ticket }) {
  const overdue = isOverdue(ticket);
  return (
    <article className={`card card-priority-${slug(ticket.priority)}`}>
      <header className="card-head">
        <h3>{ticket.title}</h3>
        <div className="badges">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </header>

      <p className="card-desc">
        {ticket.description || <span className="missing">No description provided.</span>}
      </p>

      <dl className="meta">
        <div>
          <dt>Category</dt>
          <dd>{ticket.category}</dd>
        </div>
        <div>
          <dt>Requested by</dt>
          <dd><Field value={ticket.createdBy} empty="Unknown" /></dd>
        </div>
        <div>
          <dt>Assigned to</dt>
          <dd><Field value={ticket.assignedTo} empty="Unassigned" /></dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd><Field value={formatDate(ticket.createdAt)} empty="Unknown" /></dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>
            <Field value={formatDate(ticket.dueDate)} empty="No due date" />
            {overdue && <span className="overdue">Overdue</span>}
          </dd>
        </div>
      </dl>
    </article>
  );
}
