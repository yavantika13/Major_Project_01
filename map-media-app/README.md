# Heritage Map + Media (Member 3)

React + Vite app: Google Map par heritage sites, search/filter, clustering, "mere paas wale", image + audio guide, aur Firebase Storage.

## Features
- Google Maps par clustered markers (Advanced Markers), selected site highlight
- Search (naam / state / category), State aur Category filter
- "Mere paas wale sites": browser location se nearest-first sorting aur km distance
- Site detail card: image, description, audio player, Google Maps directions
- Image ya audio na ho to graceful placeholder
- Dummy data se chalta hai; `VITE_USE_API=true` karte hi `/api/heritage` se data aata hai (fail ho to dummy par fallback)
- Firebase Storage upload helpers (size/type validation ke saath) aur `storage.rules`
- Mobile layout

## Setup
```bash
npm install
cp .env.example .env     # phir keys bharo
npm run dev
```

### Google Maps key
1. Google Cloud Console: **Maps JavaScript API** enable karo, API key banao.
2. Key ko HTTP referrer se restrict karo (`http://localhost:5173/*` aur apna production domain).
3. `.env` mein `VITE_GOOGLE_MAPS_API_KEY` daalo.
4. Optional: Cloud Map ID banao aur `VITE_GOOGLE_MAP_ID` mein daalo. Na ho to `DEMO_MAP_ID` chalta hai.

### Firebase
1. Firebase Console: project banao, **Storage** enable karo.
2. Web app register karo, config ki values `.env` ke `VITE_FIREBASE_*` mein daalo.
3. `storage.rules` ko Storage > Rules mein paste karo. (Write ke liye login chahiye, isliye Member 4/1 ki auth ke saath use hoga.)

Storage structure:
```
/images/<heritage-id>.jpg
/audio/<heritage-id>-<lang>.mp3     # sanchi-stupa-en.mp3, sanchi-stupa-hi.mp3
```

Dummy phase mein files `public/images/` aur `public/audio/` mein rakh sakte ho (naam heritage `id` ke hisaab se). Firebase ke baad `image`/`audio` mein Firebase path (`images/hampi.jpg`) ya download URL daalo; `resolveMedia()` dono handle karta hai.

## Backend se connect karna
1. `.env` mein `VITE_USE_API=true`
2. Backend `localhost:5000` par chalao (Vite `/api` ko proxy karta hai, port `vite.config.js` mein badal sakte ho).
3. `GET /api/heritage` yeh fields bheje:

| Field | Type | Note |
|---|---|---|
| `id` ya `_id` | string | unique |
| `name` | string | |
| `state` | string | filter ke liye |
| `category` | string | filter ke liye |
| `lat`, `lng` | number | ya `location.coordinates: [lng, lat]` (GeoJSON) |
| `image`, `audio` | string | public path, full URL, ya Firebase path |
| `description` | string | optional |

Response array ho ya `{ data: [...] }`, dono chalta hai. Shape badalna ho to sirf `normalizeSite()` (`src/services/api.js`) edit karo.

## Doosre members ke liye
- **Member 1:** `HeritageMap` + `Sidebar` ko apne Explore page mein component ki tarah import kar sakte ho (`src/components/`). Props `App.jsx` mein dekho.
- **Member 4:** community form mein image upload ke liye `uploadImage(id, file)` use karo (`src/services/firebase.js`).

## Structure
```
src/
  components/  HeritageMap, Sidebar, SiteDetail
  hooks/       useHeritage, useNearMe
  services/    api (fetch + normalize), firebase (upload + resolve)
  data/        heritageData (dummy)
```
