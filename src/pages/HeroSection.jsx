import { useState, useEffect } from "react";
import { Save, Loader } from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import { setDocument, getDocument } from "../hooks/useFirestore";

const DOC_ID = "hero";

export default function HeroSection() {
  const [form, setForm] = useState({
    imageUrl: "",
    imagePublicId: "",
    buttonText: "Hubungi Kami",
    buttonLink: "#contact",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocument("sections", DOC_ID).then((data) => {
      if (data) setForm((f) => ({ ...f, ...data }));
      setLoading(false);
    });
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await setDocument("sections", DOC_ID, { ...form, updatedAt: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-loading"><Loader className="spin" size={32} /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Hero Section</h1>
        <p>Kelola gambar utama dan tombol CTA di halaman depan</p>
      </div>

      <form onSubmit={handleSave} className="section-form">
        <div className="form-card">
          <h2 className="form-card-title">Gambar Hero</h2>
          <ImageUploader
            currentUrl={form.imageUrl}
            folder="rhtairpro/hero"
            label="Gambar Hero (full width)"
            onUpload={(url, publicId) =>
              setForm((f) => ({ ...f, imageUrl: url, imagePublicId: publicId }))
            }
          />
          {form.imageUrl && (
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>URL Gambar (manual)</label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          )}
        </div>

        <div className="form-card">
          <h2 className="form-card-title">Tombol CTA</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Teks Tombol</label>
              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Hubungi Kami"
              />
            </div>
            <div className="form-group">
              <label>Link Tombol</label>
              <input
                type="text"
                name="buttonLink"
                value={form.buttonLink}
                onChange={handleChange}
                placeholder="#contact"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          {saved && <span className="save-success">Tersimpan</span>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <Loader size={16} className="spin" /> : <Save size={16} />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
