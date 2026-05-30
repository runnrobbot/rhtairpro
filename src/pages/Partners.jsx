import { useState } from "react";
import { Plus, Pencil, Trash2, Loader, X, Save } from "lucide-react";
import { useCollection, setDocument, deleteDocument } from "../hooks/useFirestore";
import ImageUploader from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY_FORM = { name: "", imageUrl: "", imagePublicId: "", order: 0 };

export default function Partners() {
  const { data: partners, loading } = useCollection("partners", "order");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setForm({ ...EMPTY_FORM, order: partners.length });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({ ...p });
    setEditId(p.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const id = editId || `partner_${Date.now()}`;
      await setDocument("partners", id, { ...form, order: Number(form.order), updatedAt: new Date().toISOString() });
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDocument("partners", deleteTarget);
    setDeleteTarget(null);
  }

  if (loading) return <div className="page-loading"><Loader className="spin" size={32} /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Partner Brand</h1>
          <p>Kelola logo brand yang sudah mempercayai RHT</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Partner
        </button>
      </div>

      <div className="partners-grid">
        {partners.length === 0 && (
          <div className="empty-state">
            <p>Belum ada partner. Klik "Tambah Partner" untuk mulai.</p>
          </div>
        )}
        {partners.map((p) => (
          <div key={p.id} className="partner-card">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} />
            ) : (
              <div className="partner-placeholder">{p.name?.[0] || "?"}</div>
            )}
            <span className="partner-name">{p.name}</span>
            <div className="partner-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} aria-label="Edit"><Pencil size={14} /></button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => setDeleteTarget(p.id)} aria-label="Hapus"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editId ? "Edit Partner" : "Tambah Partner"}</h3>
              <button className="icon-btn" onClick={closeForm} aria-label="Tutup"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <ImageUploader
                  currentUrl={form.imageUrl}
                  folder="rhtairpro/partners"
                  label="Logo Partner"
                  onUpload={(url, publicId) =>
                    setForm((f) => ({ ...f, imageUrl: url, imagePublicId: publicId }))
                  }
                />
                <div className="form-group">
                  <label>Nama Brand</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nama brand"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Urutan</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                    min={0}
                  />
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
          message="Partner ini akan dihapus permanen."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
