import { useEffect, useState } from "react";
import {
  getUsers, deleteUser,
  getHeritage, addHeritage, deleteHeritage,
  getStories, deleteStory,
  getSubmissions, updateSubmissionStatus,
  getReports,
} from "./api.js";
import { categories } from "./Dummydata.js";
import "./admin.css";

const TABS = ["Dashboard", "Users", "Heritage", "Stories", "Contributions"];

export default function AdminPanel() {
  const [tab, setTab] = useState("Dashboard");
  const [data, setData] = useState({ users: [], heritage: [], stories: [], submissions: [], reports: [] });

  const load = async () => {
    const [users, heritage, stories, submissions, reports] = await Promise.all([
      getUsers(), getHeritage(), getStories(), getSubmissions(), getReports(),
    ]);
    setData({ users, heritage, stories, submissions, reports });
  };
  useEffect(() => { load(); }, []);

  const confirmDelete = async (fn, id) => {
    if (window.confirm("Pakka delete karna hai?")) {
      await fn(id);
      load();
    }
  };

  return (
    <div className="admin">
      <aside className="sidebar">
        <h3>Bharat Bytes</h3>
        {TABS.map((t) => (
          <button key={t} className={t === tab ? "tab active" : "tab"} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </aside>

      <main className="content">
        {tab === "Dashboard" && <Dashboard data={data} goTo={setTab} />}
        {tab === "Users" && <UsersTab users={data.users} onDelete={(id) => confirmDelete(deleteUser, id)} />}
        {tab === "Heritage" && <HeritageTab items={data.heritage} reload={load} onDelete={(id) => confirmDelete(deleteHeritage, id)} />}
        {tab === "Stories" && <StoriesTab items={data.stories} heritage={data.heritage} onDelete={(id) => confirmDelete(deleteStory, id)} />}
        {tab === "Contributions" && <ContributionsTab items={data.submissions} reload={load} />}
      </main>
    </div>
  );
}

function Dashboard({ data, goTo }) {
  const pending = data.submissions.filter((s) => s.status === "pending").length;
  const openReports = data.reports.filter((r) => r.status === "open").length;
  const stats = [
    ["Total Users", data.users.length],
    ["Heritage Places", data.heritage.length],
    ["Stories", data.stories.length],
    ["Pending Contributions", pending],
    ["Reports", openReports],
  ];
  const recent = [...data.submissions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <h2>Admin Dashboard</h2>
      <div className="stats">
        {stats.map(([label, n]) => (
          <div className="card stat" key={label}>
            <div className="num">{n}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title">Recent Contributions</h3>
      <Table
        cols={[
          { key: "title", label: "Title" },
          { key: "submittedBy", label: "User" },
          { key: "status", label: "Status", render: (s) => <span className={`badge ${s.status}`}>{s.status}</span> },
        ]}
        rows={recent}
        renderActions={() => (
          <button className="btn link" onClick={() => goTo("Contributions")}>View</button>
        )}
      />
    </>
  );
}

function Table({ cols, rows, renderActions }) {
  if (!rows.length) return <p className="muted">Abhi koi data nahi hai.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map((c) => <th key={c.key}>{c.label}</th>)}
            {renderActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id}>
              {cols.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
              {renderActions && <td>{renderActions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab({ users, onDelete }) {
  return (
    <>
      <h2>Users</h2>
      <Table
        cols={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "createdAt", label: "Joined" },
        ]}
        rows={users}
        renderActions={(u) =>
          u.role !== "admin" && <button className="btn danger" onClick={() => onDelete(u._id)}>Delete</button>
        }
      />
    </>
  );
}

function HeritageTab({ items, reload, onDelete }) {
  const blank = { name: "", state: "", category: categories[0] };
  const [form, setForm] = useState(blank);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.state.trim()) return;
    await addHeritage(form);
    setForm(blank);
    reload();
  };

  return (
    <>
      <h2>Heritage Places</h2>
      <form className="inline-form card" onSubmit={add}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <input name="state" placeholder="State" value={form.state} onChange={onChange} />
        <select name="category" value={form.category} onChange={onChange}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn primary">Add</button>
      </form>
      <Table
        cols={[
          { key: "name", label: "Name" },
          { key: "state", label: "State" },
          { key: "category", label: "Category" },
        ]}
        rows={items}
        renderActions={(h) => <button className="btn danger" onClick={() => onDelete(h._id)}>Delete</button>}
      />
    </>
  );
}

function StoriesTab({ items, heritage, onDelete }) {
  const nameOf = (id) => heritage.find((h) => h._id === id)?.name || "-";
  return (
    <>
      <h2>Stories</h2>
      <Table
        cols={[
          { key: "title", label: "Title" },
          { key: "heritageId", label: "Heritage", render: (s) => nameOf(s.heritageId) },
          { key: "language", label: "Language" },
          { key: "hasAudio", label: "Audio", render: (s) => (s.hasAudio ? "Yes" : "No") },
        ]}
        rows={items}
        renderActions={(s) => <button className="btn danger" onClick={() => onDelete(s._id)}>Delete</button>}
      />
    </>
  );
}

function ContributionsTab({ items, reload }) {
  const [filter, setFilter] = useState("pending");
  const rows = filter === "all" ? items : items.filter((s) => s.status === filter);

  const setStatus = async (id, status) => {
    await updateSubmissionStatus(id, status);
    reload();
  };

  return (
    <>
      <h2>Community Contributions</h2>
      <div className="filters">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button key={f} className={f === filter ? "chip active" : "chip"} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <Table
        cols={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "location", label: "Location" },
          { key: "submittedBy", label: "By" },
          { key: "status", label: "Status", render: (s) => <span className={`badge ${s.status}`}>{s.status}</span> },
        ]}
        rows={rows}
        renderActions={(s) =>
          s.status === "pending" && (
            <>
              <button className="btn primary" onClick={() => setStatus(s._id, "approved")}>Approve</button>{" "}
              <button className="btn danger" onClick={() => setStatus(s._id, "rejected")}>Reject</button>
            </>
          )
        }
      />
    </>
  );
}