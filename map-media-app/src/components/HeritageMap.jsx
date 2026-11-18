// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   APIProvider,
//   Map,
//   AdvancedMarker,
//   Pin,
//   useMap,
// } from "@vis.gl/react-google-maps";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";

// const INDIA_CENTER = { lat: 22.5, lng: 79 };
// const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID";

// function MapContent({ sites, selected, onSelect, userPosition }) {
//   const map = useMap();
//   const clusterer = useRef(null);
//   const [markers, setMarkers] = useState({});

//   // Clusterer ek baar banta hai
//   useEffect(() => {
//     if (!map || clusterer.current) return;
//     clusterer.current = new MarkerClusterer({ map });
//   }, [map]);

//   // Markers badalne par cluster refresh
//   useEffect(() => {
//     if (!clusterer.current) return;
//     clusterer.current.clearMarkers();
//     clusterer.current.addMarkers(Object.values(markers));
//   }, [markers]);

//   const setMarkerRef = useCallback((marker, id) => {
//     setMarkers((prev) => {
//       if ((marker && prev[id]) || (!marker && !prev[id])) return prev;
//       if (marker) return { ...prev, [id]: marker };
//       const { [id]: _removed, ...rest } = prev;
//       return rest;
//     });
//   }, []);

//   // Filter badalne par visible sites ke hisaab se zoom
//   useEffect(() => {
//     if (!map || !sites.length) return;
//     if (sites.length === 1) {
//       map.panTo({ lat: sites[0].lat, lng: sites[0].lng });
//       map.setZoom(9);
//       return;
//     }
//     const bounds = new google.maps.LatLngBounds();
//     sites.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
//     if (userPosition) bounds.extend(userPosition);
//     map.fitBounds(bounds, 80);
//   }, [map, sites, userPosition]);

//   // Selected site par focus
//   useEffect(() => {
//     if (!map || !selected) return;
//     map.panTo({ lat: selected.lat, lng: selected.lng });
//     if ((map.getZoom() ?? 0) < 8) map.setZoom(8);
//   }, [map, selected]);

//   return (
//     <>
//       {sites.map((site) => {
//         const active = selected?.id === site.id;
//         return (
//           <AdvancedMarker
//             key={site.id}
//             position={{ lat: site.lat, lng: site.lng }}
//             title={site.name}
//             zIndex={active ? 10 : 1}
//             ref={(marker) => setMarkerRef(marker, site.id)}
//             onClick={() => onSelect(site)}
//           >
//             <Pin
//               background={active ? "#b4390f" : "#d97706"}
//               borderColor="#7c2d12"
//               glyphColor="#fff"
//               scale={active ? 1.3 : 1}
//             />
//           </AdvancedMarker>
//         );
//       })}
//       {userPosition && (
//         <AdvancedMarker position={userPosition} title="Aap yahan hain">
//           <div className="user-dot" />
//         </AdvancedMarker>
//       )}
//     </>
//   );
// }

// export default function HeritageMap({ apiKey, ...props }) {
//   if (!apiKey) {
//     return (
//       <div className="map-fallback">
//         <h2>Google Maps API key nahi mili</h2>
//         <p>
//           <code>.env</code> mein <code>VITE_GOOGLE_MAPS_API_KEY</code> daalo aur dev server dobara
//           chalao. Tab tak list aur filters kaam karte rahenge.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <APIProvider apiKey={apiKey} language="hi" region="IN">
//       <Map
//         mapId={MAP_ID}
//         defaultCenter={INDIA_CENTER}
//         defaultZoom={5}
//         gestureHandling="greedy"
//         disableDefaultUI={false}
//         mapTypeControl={false}
//         streetViewControl={false}
//         fullscreenControl={false}
//         onClick={() => props.onSelect(null)}
//       >
//         <MapContent {...props} />
//       </Map>
//     </APIProvider>
//   );
// }


import { useCallback, useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const INDIA_CENTER = { lat: 22.5, lng: 79 };
const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID";

function MapContent({ sites, selected, onSelect, userPosition }) {
  const map = useMap();
  const clusterer = useRef(null);
  const [markers, setMarkers] = useState({});
  const markerRefCallbacks = useRef({});

  // Marker clusterer ko map ke saath initialize karo
  useEffect(() => {
    if (!map || clusterer.current) return;

    clusterer.current = new MarkerClusterer({ map });

    return () => {
      clusterer.current?.clearMarkers();
      clusterer.current?.setMap(null);
      clusterer.current = null;
    };
  }, [map]);

  // Registered markers ko clusterer mein update karo
  useEffect(() => {
    if (!clusterer.current) return;

    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers, map]);

  // Marker refs ko stable rakhne ke liye callback
  const setMarkerRef = useCallback((marker, id) => {
    setMarkers((prev) => {
      if (marker && prev[id] === marker) return prev;
      if (!marker && !prev[id]) return prev;

      if (marker) {
        return { ...prev, [id]: marker };
      }

      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Har site ke liye ek hi ref callback reuse karo
  const getMarkerRef = useCallback(
    (id) => {
      if (!markerRefCallbacks.current[id]) {
        markerRefCallbacks.current[id] = (marker) => {
          setMarkerRef(marker, id);
        };
      }

      return markerRefCallbacks.current[id];
    },
    [setMarkerRef]
  );

  // Visible sites ke hisaab se map zoom adjust karo
  useEffect(() => {
    if (!map || !sites.length) return;

    if (sites.length === 1) {
      map.panTo({
        lat: Number(sites[0].lat),
        lng: Number(sites[0].lng),
      });
      map.setZoom(9);
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    sites.forEach((site) => {
      bounds.extend({
        lat: Number(site.lat),
        lng: Number(site.lng),
      });
    });

    if (userPosition) {
      bounds.extend(userPosition);
    }

    map.fitBounds(bounds, 80);
  }, [map, sites, userPosition]);

  // Selected heritage site par focus karo
  useEffect(() => {
    if (!map || !selected) return;

    map.panTo({
      lat: Number(selected.lat),
      lng: Number(selected.lng),
    });

    if ((map.getZoom() ?? 0) < 8) {
      map.setZoom(8);
    }
  }, [map, selected]);

  return (
    <>
      {sites.map((site) => {
        const active = selected?.id === site.id;

        return (
          <AdvancedMarker
            key={site.id}
            position={{
              lat: Number(site.lat),
              lng: Number(site.lng),
            }}
            title={site.name}
            zIndex={active ? 10 : 1}
            ref={getMarkerRef(site.id)}
            onClick={() => onSelect(site)}
          >
            <Pin
              background={active ? "#b4390f" : "#d97706"}
              borderColor="#7c2d12"
              glyphColor="#fff"
              scale={active ? 1.3 : 1}
            />
          </AdvancedMarker>
        );
      })}

      {userPosition && (
        <AdvancedMarker
          position={userPosition}
          title="Aap yahan hain"
        >
          <div className="user-dot" />
        </AdvancedMarker>
      )}
    </>
  );
}

export default function HeritageMap({ apiKey, ...props }) {
  if (!apiKey) {
    return (
      <div className="map-fallback">
        <h2>Google Maps API key nahi mili</h2>
        <p>
          <code>.env</code> mein{" "}
          <code>VITE_GOOGLE_MAPS_API_KEY</code> set karo
          aur development server restart karo.
          Tab tak list aur filters kaam karte rahenge.
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      language="hi"
      region="IN"
    >
      <Map
        mapId={MAP_ID}
        defaultCenter={INDIA_CENTER}
        defaultZoom={5}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onClick={() => props.onSelect(null)}
      >
        <MapContent {...props} />
      </Map>
    </APIProvider>
  );
}