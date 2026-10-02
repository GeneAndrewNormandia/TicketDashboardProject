import { StatusBadge, PriorityBadge } from "./Badges";
import Field from "./Field";
import { formatDate, isOverdue } from "../utils/tickets";

export default function TicketTable({ tickets }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Support tickets</caption>
        <thead>
          <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            <th scope="col">Category</th>
            <th scope="col">Requested by</th>
            <th scope="col">Assigned to</th>
            <th scope="col">Created</th>
            <th scope="col">Due</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.key}>
              <td className="cell-title">
                <strong>{t.title}</strong>
                <span>{t.description || <span className="missing">No description provided.</span>}</span>
              </td>
              <td><StatusBadge status={t.status} /></td>
              <td><PriorityBadge priority={t.priority} /></td>
              <td>{t.category}</td>
              <td className="break"><Field value={t.createdBy} empty="Unknown" /></td>
              <td className="break"><Field value={t.assignedTo} empty="Unassigned" /></td>
              <td className="nowrap"><Field value={formatDate(t.createdAt)} empty="Unknown" /></td>
              <td className="nowrap">
                <Field value={formatDate(t.dueDate)} empty="No due date" />
                {isOverdue(t) && <span className="overdue">Overdue</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
