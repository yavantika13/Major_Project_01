import { useEffect, useState } from "react";
import { fetchHeritage } from "../services/api.js";

export function useHeritage() {
  const [state, setState] = useState({ sites: [], loading: true, source: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    fetchHeritage(controller.signal)
      .then(({ sites, source, error }) =>
        setState({ sites, loading: false, source, error: error ?? null })
      )
      .catch((err) => {
        if (err.name !== "AbortError") setState((s) => ({ ...s, loading: false, error: err.message }));
      });
    return () => controller.abort();
  }, []);

  return state;
}
