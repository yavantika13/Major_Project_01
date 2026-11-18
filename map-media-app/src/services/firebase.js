// Firebase Storage (Member 3). Config .env se aata hai, isliye keys code mein hardcode nahi hoti.
//
// Storage structure:
//   /images/<heritage-id>.jpg
//   /audio/<heritage-id>-<lang>.mp3     (e.g. sanchi-stupa-en.mp3, sanchi-stupa-hi.mp3)
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseReady = Boolean(config.apiKey && config.storageBucket);

let storage = null;
if (isFirebaseReady) {
  const app = getApps()[0] ?? initializeApp(config);
  storage = getStorage(app);
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // storage.rules ke saath same rakho

function requireStorage() {
  if (!storage) throw new Error("Firebase configure nahi hai. .env mein VITE_FIREBASE_* bharo.");
  return storage;
}

export async function uploadImage(heritageId, file) {
  if (!file.type.startsWith("image/")) throw new Error("Sirf image file allowed hai.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image 5MB se choti honi chahiye.");
  const r = ref(requireStorage(), `images/${heritageId}.jpg`);
  await uploadBytes(r, file, { contentType: file.type });
  return getDownloadURL(r);
}

export async function uploadAudio(heritageId, file, lang = "en") {
  if (!file.type.startsWith("audio/")) throw new Error("Sirf audio file allowed hai.");
  if (file.size > MAX_AUDIO_BYTES) throw new Error("Audio 20MB se chhota hona chahiye.");
  const r = ref(requireStorage(), `audio/${heritageId}-${lang}.mp3`);
  await uploadBytes(r, file, { contentType: file.type });
  return getDownloadURL(r);
}

const urlCache = new Map();

// Full URL ya "/images/x.jpg" jaisa public path ho to waise hi wapas; "images/x.jpg" jaisa
// Firebase path ho aur Firebase ready ho to download URL resolve karta hai.
export async function resolveMedia(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/.test(path) || path.startsWith("/")) return path;
  if (!storage) return null;
  if (urlCache.has(path)) return urlCache.get(path);
  try {
    const url = await getDownloadURL(ref(storage, path));
    urlCache.set(path, url);
    return url;
  } catch {
    return null;
  }
}
