import { useMemo, useState } from "react";
import HeritageMap from "./components/HeritageMap.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SiteDetail from "./components/SiteDetail.jsx";
import { useHeritage } from "./hooks/useHeritage.js";
import { useNearMe, distanceKm } from "./hooks/useNearMe.js";

const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b));

export default function App() {
  const { sites, loading, source } = useHeritage();
  const nearMe = useNearMe();

  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const states = useMemo(() => unique(sites.map((s) => s.state)), [sites]);
  const categories = useMemo(() => unique(sites.map((s) => s.category)), [sites]);

  const distances = useMemo(() => {
    if (!nearMe.position) return {};
    return Object.fromEntries(sites.map((s) => [s.id, distanceKm(nearMe.position, s)]));
  }, [sites, nearMe.position]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sites.filter(
      (s) =>
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)) &&
        (!state || s.state === state) &&
        (!category || s.category === category)
    );
    return nearMe.position
      ? [...list].sort((a, b) => distances[a.id] - distances[b.id])
      : [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [sites, query, state, category, nearMe.position, distances]);

  // Filter ke baad selected site hat jaye to detail bhi band
  const selected = filtered.find((s) => s.id === selectedId) ?? null;
  const select = (site) => setSelectedId(site ? site.id : null);

  return (
    <div className="app">
      <Sidebar
        query={query}
        setQuery={setQuery}
        state={state}
        setState={setState}
        category={category}
        setCategory={setCategory}
        states={states}
        categories={categories}
        sites={filtered}
        selectedId={selected?.id}
        onSelect={select}
        distances={distances}
        nearMe={nearMe}
        loading={loading}
        source={source}
      />
      <main className="map-wrap">
        <HeritageMap
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          sites={filtered}
          selected={selected}
          onSelect={select}
          userPosition={nearMe.position}
        />
        {selected && (
          <SiteDetail
            site={selected}
            distance={distances[selected.id]}
            onClose={() => select(null)}
          />
        )}
      </main>
    </div>
  );
}
