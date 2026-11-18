import { useCallback, useState } from "react";

export function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function useNearMe() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | denied | error

  const locate = useCallback(() => {
    if (!navigator.geolocation) return setStatus("error");
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setStatus("idle");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  const clear = useCallback(() => setPosition(null), []);

  return { position, status, locate, clear };
}
