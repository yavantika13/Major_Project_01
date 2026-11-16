import { useState } from "react";
import { createSubmission } from "./Api.js";
import { categories } from "./Dummydata.js";
import "./admin.css";

const empty = { title: "", category: "", location: "", description: "" };

export default function CommunityForm() {
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Sirf image file select karein" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image 5MB se choti honi chahiye" });
      return;
    }
    setErrors({ ...errors, image: "" });
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title Important";
    if (!form.category) e.category = " Select Category ";
    if (!form.location.trim()) e.location = " Write Location ";
    if (form.description.trim().length < 20) e.description = "Description written atleast 20 characters ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Abhi image ka sirf preview URL bhej rahe hain.
      // Baad mein Member 3 ka Firebase upload yahan connect hoga.
      await createSubmission({ ...form, imageUrl: preview, submittedBy: "Current User" });
      setDone(true);
      setForm(empty);
      setImage(null);
      setPreview("");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card form-card">
        <h2>Thankyou! 🙏</h2>
        <p>Your submission has been sent to the admin for verification (status: pending).</p>
        <button className="btn primary" onClick={() => setDone(false)}>Submit Another</button>
      </div>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit} noValidate>
      <h2>Contribute Heritage Information </h2>

      <label>Title
        <input name="title" value={form.title} onChange={onChange} placeholder="Jaise: Udayagiri Caves" />
        {errors.title && <span className="err">{errors.title}</span>}
      </label>

      <label>Category
        <select name="category" value={form.category} onChange={onChange}>
          <option value="">-- Select --</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        {errors.category && <span className="err">{errors.category}</span>}
      </label>

      <label>Location
        <input name="location" value={form.location} onChange={onChange} placeholder="City, State" />
        {errors.location && <span className="err">{errors.location}</span>}
      </label>

      <label>Description
        <textarea name="description" rows="5" value={form.description} onChange={onChange} />
        {errors.description && <span className="err">{errors.description}</span>}
      </label>

      <label>Image (optional)
        <input type="file" accept="image/*" onChange={onImage} />
        {errors.image && <span className="err">{errors.image}</span>}
      </label>
      {preview && <img src={preview} alt="preview" className="preview" />}

      <button className="btn primary" disabled={loading}>
        {loading ? "Submit ho raha hai..." : "Submit"}
      </button>
    </form>
  );
}