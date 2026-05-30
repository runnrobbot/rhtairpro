import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-box">
        <div className="modal-icon warning">
          <AlertTriangle size={28} />
        </div>
        <h3>Konfirmasi Hapus</h3>
        <p>{message || "Apakah Anda yakin ingin menghapus item ini?"}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
