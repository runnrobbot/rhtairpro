import { useState } from "react";
import { Plus, Pencil, Trash2, Loader, GripVertical, X, Save } from "lucide-react";
import { useCollection, setDocument, deleteDocument } from "../hooks/useFirestore";
import ImageUploader from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY_FORM = { name: "", description: "", imageUrl: "", imagePublicId: "", order: 0 };

export default function Products() {
  const { data: products, loading } = useCollection("products", "order");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setForm({ ...EMPTY_FORM, order: products.length });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(product) {
    setForm({ ...product });
    setEditId(product.id);
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
      const id = editId || `product_${Date.now()}`;
      await setDocument("products", id, { ...form, updatedAt: new Date().toISOString() });
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDocument("products", deleteTarget);
    setDeleteTarget(null);
  }

  if (loading) return <div className="page-loading"><Loader className="spin" size={32} /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Produk</h1>
          <p>Kelola daftar produk yang tampil di slider website</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Product List */}
      <div className="items-list">
        {products.length === 0 && (
          <div className="empty-state">
            <p>Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
          </div>
        )}
        {products.map((p) => (
          <div key={p.id} className="item-row">
            <div className="item-drag">
              <GripVertical size={16} />
            </div>
            <div className="item-image">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} />
              ) : (
                <div className="item-image-placeholder" />
              )}
            </div>
            <div className="item-info">
              <span className="item-name">{p.name || "Tanpa nama"}</span>
              {p.description && <span className="item-desc">{p.description}</span>}
            </div>
            <div className="item-order">#{p.order + 1}</div>
            <div className="item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => setDeleteTarget(p.id)} aria-label="Hapus">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box modal-large">
            <div className="modal-header">
              <h3>{editId ? "Edit Produk" : "Tambah Produk"}</h3>
              <button className="icon-btn" onClick={closeForm} aria-label="Tutup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <ImageUploader
                  currentUrl={form.imageUrl}
                  folder="rhtairpro/products"
                  label="Gambar Produk"
                  onUpload={(url, publicId) =>
                    setForm((f) => ({ ...f, imageUrl: url, imagePublicId: publicId }))
                  }
                />
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: RM-480"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi (opsional)</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Deskripsi singkat produk..."
                  />
                </div>
                <div className="form-group">
                  <label>Urutan Tampil</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
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

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmModal
          message="Produk ini akan dihapus permanen."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
