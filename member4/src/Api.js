// Service layer: components sirf is file ke functions use karte hain.
// Backend ready hone par USE_DUMMY = false karo aur axios wale part ko enable karo.
// Components mein koi change nahi karna padega.

import { users, heritage, stories, submissions, reports } from "./Dummydata.js";

const USE_DUMMY = true;
// import axios from "axios";
// const http = axios.create({ baseURL: "http://localhost:5000/api" });
// http.interceptors.request.use((cfg) => {
//   const token = localStorage.getItem("token");
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

// In-memory copies (page refresh par reset ho jayenge, dummy mode mein theek hai)
let db = {
  users: [...users],
  heritage: [...heritage],
  stories: [...stories],
  submissions: [...submissions],
  reports: [...reports],
};

const delay = (data) => new Promise((res) => setTimeout(() => res(data), 200));
const newId = (p) => p + Date.now();

// ---------- Submissions ----------
export async function getSubmissions() {
  if (USE_DUMMY) return delay([...db.submissions]);
  // return (await http.get("/submissions")).data;
}

export async function createSubmission(payload) {
  if (USE_DUMMY) {
    const item = {
      _id: newId("sub"),
      ...payload,
      status: "pending", // hamesha pending se start
      createdAt: new Date().toISOString().slice(0, 10),
    };
    db.submissions = [item, ...db.submissions];
    return delay(item);
  }
  // Real mode mein image FormData se jayegi:
  // return (await http.post("/submissions", payload)).data;
}

export async function updateSubmissionStatus(id, status) {
  if (USE_DUMMY) {
    db.submissions = db.submissions.map((s) => (s._id === id ? { ...s, status } : s));
    return delay(true);
  }
  // return (await http.patch(`/submissions/${id}`, { status })).data;
}

// ---------- Heritage ----------
export async function getHeritage() {
  if (USE_DUMMY) return delay([...db.heritage]);
  // return (await http.get("/heritage")).data;
}

export async function addHeritage(payload) {
  if (USE_DUMMY) {
    const item = { _id: newId("h"), ...payload };
    db.heritage = [item, ...db.heritage];
    return delay(item);
  }
  // return (await http.post("/heritage", payload)).data;
}

export async function deleteHeritage(id) {
  if (USE_DUMMY) {
    db.heritage = db.heritage.filter((h) => h._id !== id);
    return delay(true);
  }
  // return (await http.delete(`/heritage/${id}`)).data;
}

// ---------- Stories ----------
export async function getStories() {
  if (USE_DUMMY) return delay([...db.stories]);
  // return (await http.get("/stories")).data;
}

export async function deleteStory(id) {
  if (USE_DUMMY) {
    db.stories = db.stories.filter((s) => s._id !== id);
    return delay(true);
  }
  // return (await http.delete(`/stories/${id}`)).data;
}

// ---------- Reports ----------
export async function getReports() {
  if (USE_DUMMY) return delay([...db.reports]);
  // return (await http.get("/reports")).data;
}

// ---------- Users ----------
export async function getUsers() {
  if (USE_DUMMY) return delay([...db.users]);
  // return (await http.get("/users")).data;
}

export async function deleteUser(id) {
  if (USE_DUMMY) {
    db.users = db.users.filter((u) => u._id !== id);
    return delay(true);
  }
  // return (await http.delete(`/users/${id}`)).data;
}