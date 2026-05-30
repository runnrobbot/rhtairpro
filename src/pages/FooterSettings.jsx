import { useState, useEffect } from "react";
import { Save, Loader } from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import { setDocument, getDocument } from "../hooks/useFirestore";

// Semua string yang mengandung @ dipisah agar tidak glitch di font Antipasto Pro
const AT = "\u0040"; // karakter @
const DEFAULT_EMAIL    = "info" + AT + "rht.com";
const DEFAULT_CTA_LINK = "mailto:info" + AT + "rht.com";

export default function FooterSettings() {
  const [form, setForm] = useState({
    ctaImageUrl: "",
    ctaImagePublicId: "",
    ctaButtonText: "Hubungi Kami",
    ctaButtonLink: DEFAULT_CTA_LINK,
    email: DEFAULT_EMAIL,
    phone: "+62 21 xxxx xxxx",
    copyright: "2025 RHT. All rights reserved.",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    whatsapp: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocument("sections", "footer").then((data) => {
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
      await setDocument("sections", "footer", {
        ...form,
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <Loader className="spin" size={32} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>CTA &amp; Footer</h1>
        <p>Kelola section CTA terakhir, informasi kontak, dan link sosial media</p>
      </div>

      <form onSubmit={handleSave} className="section-form">

        {/* Final CTA */}
        <div className="form-card">
          <h2 className="form-card-title">Final CTA Section</h2>
          <ImageUploader
            currentUrl={form.ctaImageUrl}
            folder="rhtairpro/cta"
            label="Gambar CTA"
            onUpload={(url, publicId) =>
              setForm((f) => ({ ...f, ctaImageUrl: url, ctaImagePublicId: publicId }))
            }
          />
          <div className="form-row" style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label>Teks Tombol CTA</label>
              <input
                type="text"
                name="ctaButtonText"
                value={form.ctaButtonText}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Link Tombol CTA</label>
              <input
                type="text"
                name="ctaButtonLink"
                value={form.ctaButtonLink}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="form-card">
          <h2 className="form-card-title">Informasi Kontak</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+62 21 xxxx xxxx"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Teks Copyright (tanpa simbol &copy;)</label>
            <input
              type="text"
              name="copyright"
              value={form.copyright}
              onChange={handleChange}
              placeholder="2025 RHT. All rights reserved."
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="form-card">
          <h2 className="form-card-title">Sosial Media</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/namahalaman"
              />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/namaakun"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Twitter / X URL</label>
              <input
                type="url"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="https://x.com/namaakun"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/nama"
              />
            </div>
          </div>
          <div className="form-group">
            <label>WhatsApp (nomor dengan kode negara, tanpa +)</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="6281234567890"
            />
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
