// import { heritageSites as dummySites } from "../data/heritageData.js";

// const USE_API = import.meta.env.VITE_USE_API === "true";

// // Backend alag shape bheje (Mongo _id, GeoJSON coordinates [lng, lat], nested location) to bhi chalega.
// export function normalizeSite(raw) {
//   const lat = Number(raw.lat ?? raw.latitude ?? raw.location?.lat ?? raw.location?.coordinates?.[1]);
//   const lng = Number(raw.lng ?? raw.longitude ?? raw.location?.lng ?? raw.location?.coordinates?.[0]);
//   return {
//     id: String(raw.id ?? raw._id ?? raw.slug ?? raw.name),
//     name: raw.name ?? "Unknown",
//     state: raw.state ?? "",
//     category: raw.category ?? "Other",
//     lat,
//     lng,
//     image: raw.image ?? raw.images?.[0] ?? null,
//     audio: raw.audio ?? raw.audioUrl ?? null,
//     description: raw.description ?? "",
//   };
// }

// const isValid = (s) => Number.isFinite(s.lat) && Number.isFinite(s.lng);

// export async function fetchHeritage(signal) {
//   if (!USE_API) return { sites: dummySites, source: "dummy" };
//   try {
//     const res = await fetch("/api/heritage", { signal });
//     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     const data = await res.json();
//     const list = Array.isArray(data) ? data : data.data ?? data.heritage ?? [];
//     const sites = list.map(normalizeSite).filter(isValid);
//     if (!sites.length) throw new Error("API se koi valid location nahi mili");
//     return { sites, source: "api" };
//   } catch (err) {
//     if (err.name === "AbortError") throw err;
//     console.warn("[heritage] API fail hui, dummy data use ho raha hai:", err.message);
//     return { sites: dummySites, source: "dummy", error: err.message };
//   }
// }





import { heritageSites as dummySites } from "../data/heritageData.js";

const USE_API = import.meta.env.VITE_USE_API === "true";

// Backend data ko consistent format mein convert karta hai.
export function normalizeSite(raw) {
  const lat = Number(
    raw.lat ??
      raw.latitude ??
      raw.location?.lat ??
      raw.location?.coordinates?.[1]
  );

  const lng = Number(
    raw.lng ??
      raw.longitude ??
      raw.location?.lng ??
      raw.location?.coordinates?.[0]
  );

  return {
    id: String(raw.id ?? raw._id ?? raw.slug ?? raw.name),
    name: raw.name ?? "Unknown",
    state: raw.state ?? "",
    category: raw.category ?? "Other",
    lat,
    lng,
    image: raw.image ?? raw.images?.[0] ?? null,
    audio: raw.audio ?? raw.audioUrl ?? null,
    audioHi: raw.audioHi ?? raw.audioHiUrl ?? null,
    description: raw.description ?? "",
  };
}

// Invalid coordinates wale sites ko map par show nahi karte.
const isValid = (site) =>
  Number.isFinite(site.lat) &&
  Number.isFinite(site.lng) &&
  site.lat >= -90 &&
  site.lat <= 90 &&
  site.lng >= -180 &&
  site.lng <= 180;

// Heritage data load karta hai.
export async function fetchHeritage(signal) {
  // Local data mode
  if (!USE_API) {
    return {
      sites: dummySites,
      source: "dummy",
      error: null,
    };
  }

  // Backend API mode
  try {
    const res = await fetch("/api/heritage", { signal });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : data.data ?? data.heritage ?? [];

    const sites = list
      .map(normalizeSite)
      .filter(isValid);

    if (!sites.length) {
      throw new Error("API se koi valid location nahi mili");
    }

    return {
      sites,
      source: "api",
      error: null,
    };
  } catch (err) {
    // Component unmount hone par abort ko handle karna.
    if (err.name === "AbortError") {
      throw err;
    }

    console.warn(
      "[heritage] API fail hui, dummy data use ho raha hai:",
      err.message
    );

    return {
      sites: dummySites,
      source: "dummy",
      error: err.message,
    };
  }
}