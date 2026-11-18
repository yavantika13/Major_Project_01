export default function Sidebar({
  query,
  setQuery,
  state,
  setState,
  category,
  setCategory,
  states,
  categories,
  sites,
  selectedId,
  onSelect,
  distances,
  nearMe,
  loading,
  source,
}) {
  const nearActive = Boolean(nearMe.position);

  return (
    <aside className="sidebar">
      <header>
        <h1>Heritage Map</h1>
        {source === "dummy" && <span className="badge">Demo data</span>}
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Site ya state khojo..."
        aria-label="Search"
      />

      <div className="row">
        <select value={state} onChange={(e) => setState(e.target.value)} aria-label="State">
          <option value="">Saare states</option>
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          <option value="">Saari categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <button
        className={`btn ghost ${nearActive ? "on" : ""}`}
        onClick={nearActive ? nearMe.clear : nearMe.locate}
        disabled={nearMe.status === "loading"}
      >
        {nearMe.status === "loading"
          ? "Location dhoondh rahe hain..."
          : nearActive
            ? "Mere paas wale: ON (band karo)"
            : "Mere paas wale sites"}
      </button>
      {nearMe.status === "denied" && (
        <p className="muted">Location ki permission nahi mili. Browser settings mein allow karo.</p>
      )}
      {nearMe.status === "error" && <p className="muted">Location nahi mil paayi.</p>}

      <p className="count" aria-live="polite">
        {loading ? "Load ho raha hai..." : `${sites.length} site${sites.length === 1 ? "" : "s"}`}
      </p>

      <ul className="list">
        {sites.map((site) => (
          <li key={site.id}>
            <button
              className={site.id === selectedId ? "active" : ""}
              onClick={() => onSelect(site)}
            >
              <strong>{site.name}</strong>
              <small>
                {site.state} · {site.category}
                {distances[site.id] != null && ` · ${Math.round(distances[site.id])} km`}
              </small>
            </button>
          </li>
        ))}
        {!loading && sites.length === 0 && (
          <li className="empty">Koi site nahi mili. Filters badal kar dekho.</li>
        )}
      </ul>
    </aside>
  );
}
