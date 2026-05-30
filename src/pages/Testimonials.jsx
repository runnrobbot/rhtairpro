import { useState } from "react";
import { Plus, Pencil, Trash2, Loader, X, Save, Star } from "lucide-react";
import { useCollection, setDocument, deleteDocument } from "../hooks/useFirestore";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY_FORM = { author: "", role: "", text: "", stars: 5, order: 0 };

export default function Testimonials() {
  const { data: testimonials, loading } = useCollection("testimonials", "order");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setForm({ ...EMPTY_FORM, order: testimonials.length });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(t) {
    setForm({ ...t });
    setEditId(t.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const id = editId || `testimonial_${Date.now()}`;
      await setDocument("testimonials", id, {
        ...form,
        stars: Number(form.stars),
        order: Number(form.order),
        updatedAt: new Date().toISOString(),
      });
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDocument("testimonials", deleteTarget);
    setDeleteTarget(null);
  }

  if (loading) return <div className="page-loading"><Loader className="spin" size={32} /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Testimonial</h1>
          <p>Kelola ulasan pelanggan yang tampil di website</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Testimonial
        </button>
      </div>

      <div className="items-list">
        {testimonials.length === 0 && (
          <div className="empty-state">
            <p>Belum ada testimonial. Klik "Tambah Testimonial" untuk mulai.</p>
          </div>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="item-row">
            <div className="item-info">
              <div className="testimonial-stars">
                {Array.from({ length: t.stars || 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#f5a623" color="#f5a623" />
                ))}
              </div>
              <span className="item-name">{t.author}</span>
              {t.role && <span className="item-badge">{t.role}</span>}
              <span className="item-desc">{t.text}</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)} aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => setDeleteTarget(t.id)} aria-label="Hapus">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box modal-large">
            <div className="modal-header">
              <h3>{editId ? "Edit Testimonial" : "Tambah Testimonial"}</h3>
              <button className="icon-btn" onClick={closeForm} aria-label="Tutup"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nama</label>
                    <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="Nama pelanggan" required />
                  </div>
                  <div className="form-group">
                    <label>Jabatan / Peran</label>
                    <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Manajer Produksi" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Ulasan</label>
                  <textarea name="text" value={form.text} onChange={handleChange} rows={4} placeholder="Tulis ulasan..." required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bintang (1–5)</label>
                    <select name="stars" value={form.stars} onChange={handleChange}>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Bintang</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Urutan</label>
                    <input type="number" name="order" value={form.order} onChange={handleChange} min={0} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeForm}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader size={15} className="spin" /> : <Save size={15} />}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message="Testimonial ini akan dihapus permanen."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
