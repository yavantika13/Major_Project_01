// Dummy data: backend ready hone tak isi se kaam chalega.
// Fields MongoDB schema se match rakhe gaye hain taaki baad mein switch easy ho.

// Design ke hisaab se categories
export const categories = [
  "Monuments",
  "Folk Art",
  "Handicrafts",
  "Festivals",
  "Folk Music",
  "Food",
  "Traditions",
];

export const users = [
  { _id: "u1", name: "Aarav Sharma", email: "aarav@example.com", role: "user", createdAt: "2026-09-01" },
  { _id: "u2", name: "Priya Verma", email: "priya@example.com", role: "user", createdAt: "2026-09-12" },
  { _id: "u3", name: "Admin", email: "admin@bharatbytes.in", role: "admin", createdAt: "2026-08-20" },
];

export const heritage = [
  { _id: "h1", name: "Sanchi Stupa", state: "Madhya Pradesh", category: "Monuments" },
  { _id: "h2", name: "Hampi", state: "Karnataka", category: "Monuments" },
  { _id: "h3", name: "Konark Sun Temple", state: "Odisha", category: "Monuments" },
  { _id: "h4", name: "Madhubani Art", state: "Bihar", category: "Folk Art" },
];

export const stories = [
  { _id: "s1", title: "Ashoka aur Sanchi ki kahani", heritageId: "h1", language: "Hindi", hasAudio: true },
  { _id: "s2", title: "The Stone Chariot of Konark", heritageId: "h3", language: "English", hasAudio: false },
];

export const submissions = [
  {
    _id: "sub1",
    title: "Udayagiri Caves ke baare mein extra info",
    category: "Monuments",
    location: "Vidisha, Madhya Pradesh",
    description: "Sanchi ke paas Udayagiri caves ki history aur Gupta period ka connection.",
    imageUrl: "",
    submittedBy: "Aarav Sharma",
    status: "pending", // pending | approved | rejected
    createdAt: "2026-10-18",
  },
  {
    _id: "sub2",
    title: "Traditional Food of Malwa",
    category: "Food",
    location: "Indore, Madhya Pradesh",
    description: "Poha-jalebi aur dal-bafla ka cultural importance aur history.",
    imageUrl: "",
    submittedBy: "Priya Verma",
    status: "approved",
    createdAt: "2026-10-10",
  },
  {
    _id: "sub3",
    title: "Gond Painting ki details",
    category: "Folk Art",
    location: "Dindori, Madhya Pradesh",
    description: "Gond tribal art ki techniques aur kahaniyan.",
    imageUrl: "",
    submittedBy: "Aarav Sharma",
    status: "pending",
    createdAt: "2026-10-20",
  },
];

// Reports: users ne galat ya misleading content ke liye flag kiya
export const reports = [
  { _id: "r1", targetType: "story", targetId: "s2", reason: "Galat date likhi hai", reportedBy: "Priya Verma", status: "open" },
  { _id: "r2", targetType: "heritage", targetId: "h2", reason: "Image sahi nahi hai", reportedBy: "Aarav Sharma", status: "open" },
  { _id: "r3", targetType: "submission", targetId: "sub1", reason: "Duplicate content", reportedBy: "Priya Verma", status: "open" },
];