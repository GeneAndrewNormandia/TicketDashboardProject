import { useMemo, useState } from "react";
import useTickets from "./hooks/useTickets";
import Toolbar from "./components/Toolbar";
import TicketCard from "./components/TicketCard";
import TicketTable from "./components/TicketTable";
import {
  filterAndSort,
  getCategoryOptions,
  getStatusOptions,
} from "./utils/tickets";

const DEFAULT_FILTERS = { query: "", status: "all", category: "all", priority: "all", sort: "newest" };

const initialView = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches
    ? "table"
    : "cards";

export default function App() {
  const { status, tickets, error, source, loadFile, reload } = useTickets();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState(initialView);

  const statusOptions = useMemo(() => getStatusOptions(tickets), [tickets]);
  const categories = useMemo(() => getCategoryOptions(tickets), [tickets]);
  const visible = useMemo(() => filterAndSort(tickets, filters), [tickets, filters]);

  const countFor = (s) => tickets.filter((t) => t.status === s).length;
  const hasActiveFilters =
    filters.query || filters.status !== "all" || filters.category !== "all" || filters.priority !== "all";

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilters(DEFAULT_FILTERS);
      loadFile(file);
    }
    e.target.value = ""; // allow picking the same file again
  };

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1>Support tickets</h1>
          <p className="sub" aria-live="polite">
            {status === "ready"
              ? `${tickets.length} ${tickets.length === 1 ? "ticket" : "tickets"} loaded from ${source}`
              : status === "loading"
              ? "Loading tickets…"
              : `Could not read ${source}`}
          </p>
        </div>
        <label className="btn">
          Open another JSON file
          <input type="file" accept="application/json,.json" onChange={onPickFile} hidden />
        </label>
      </header>

      {status === "loading" && <p className="notice" role="status">Loading tickets…</p>}

      {status === "error" && (
        <div className="notice error" role="alert">
          <strong>Tickets could not be loaded.</strong>
          <p>{error}</p>
          <button type="button" className="btn" onClick={reload}>Reload the default file</button>
        </div>
      )}

      {status === "ready" && tickets.length === 0 && (
        <div className="notice empty">
          <strong>No tickets in this file.</strong>
          <p>Add entries to the "tickets" list, or open a different JSON file.</p>
        </div>
      )}

      {status === "ready" && tickets.length > 0 && (
        <>
          <div className="status-tabs" role="group" aria-label="Filter by status">
            <button
              type="button"
              aria-pressed={filters.status === "all"}
              onClick={() => setFilters((f) => ({ ...f, status: "all" }))}
            >
              All <b>{tickets.length}</b>
            </button>
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={filters.status === s}
                onClick={() => setFilters((f) => ({ ...f, status: f.status === s ? "all" : s }))}
              >
                {s} <b>{countFor(s)}</b>
              </button>
            ))}
          </div>

          <Toolbar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            view={view}
            setView={setView}
          />

          <p className="results-count" aria-live="polite">
            Showing {visible.length} of {tickets.length}
            {hasActiveFilters && (
              <button type="button" className="link" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </button>
            )}
          </p>

          {visible.length === 0 ? (
            <div className="notice empty">
              <strong>No tickets match these filters.</strong>
              <p>Try a different search, or clear the filters to see everything.</p>
              <button type="button" className="btn" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </button>
            </div>
          ) : view === "table" ? (
            <TicketTable tickets={visible} />
          ) : (
            <div className="card-grid">
              {visible.map((t) => (
                <TicketCard key={t.key} ticket={t} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
