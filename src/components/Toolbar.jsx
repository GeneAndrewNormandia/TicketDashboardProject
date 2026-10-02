import { SORT_OPTIONS, PRIORITY_ORDER } from "../utils/tickets";

export default function Toolbar({ filters, setFilters, categories, view, setView }) {
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="toolbar">
      <label className="field search">
        <span>Search</span>
        <input
          type="search"
          value={filters.query}
          onChange={set("query")}
          placeholder="Title, description, or email"
        />
      </label>

      <label className="field">
        <span>Category</span>
        <select value={filters.category} onChange={set("category")}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Priority</span>
        <select value={filters.priority} onChange={set("priority")}>
          <option value="all">All priorities</option>
          {PRIORITY_ORDER.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select value={filters.sort} onChange={set("sort")}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <div className="view-toggle" role="group" aria-label="Layout">
        <button type="button" aria-pressed={view === "cards"} onClick={() => setView("cards")}>
          Cards
        </button>
        <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>
          Table
        </button>
      </div>
    </div>
  );
}
