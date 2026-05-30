import { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import { uploadToCloudinary } from "../cloudinary";

/**
 * Reusable image uploader component
 * Props:
 *   currentUrl  - existing image URL to preview
 *   onUpload    - callback(url, publicId) after successful upload
 *   folder      - Cloudinary folder name
 *   label       - input label text
 */
export default function ImageUploader({
  currentUrl = "",
  onUpload,
  folder = "rhtairpro",
  label = "Upload Gambar",
}) {
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");
    try {
      const { url, publicId } = await uploadToCloudinary(file, folder);
      setPreview(url);
      onUpload(url, publicId);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    setPreview("");
    onUpload("", "");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="image-uploader">
      <label className="uploader-label">{label}</label>

      {preview ? (
        <div className="uploader-preview">
          <img src={preview} alt="preview" />
          {!uploading && (
            <button
              type="button"
              className="uploader-clear"
              onClick={clearImage}
              aria-label="Hapus gambar"
            >
              <X size={16} />
            </button>
          )}
          {uploading && (
            <div className="uploader-overlay">
              <Loader size={24} className="spin" />
              <span>Mengupload...</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="uploader-dropzone"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader size={24} className="spin" />
              <span>Mengupload...</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span>Klik untuk pilih gambar</span>
              <small>PNG, JPG, WEBP - maks 10MB</small>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {error && <p className="uploader-error">{error}</p>}
    </div>
  );
}
