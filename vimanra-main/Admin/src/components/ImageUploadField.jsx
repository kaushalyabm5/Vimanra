import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

const VALID_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

// Photos come off a phone at several megabytes, but Vercel rejects any request
// body over 4.5 MB before Express ever sees it — and the image travels as
// base64, which is a third larger again. Downscaling in the browser keeps a
// typical upload in the low hundreds of kilobytes, which also stops the
// image_url column from growing without bound.
const MAX_EDGE = 1600;
const QUALITY = 0.82;
const MAX_ENCODED_BYTES = 3.5 * 1024 * 1024;

const formatSize = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;

// Size of what actually goes over the wire: base64 carries 3 bytes per 4 chars.
const encodedBytes = (dataUrl) => Math.round(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);

const downscale = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = objectUrl;
  });

export default function ImageUploadField({ label = "Image", value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileError, setFileError] = useState("");
  const [meta, setMeta] = useState(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!VALID_TYPES.includes(file.type)) {
      setFileError("Invalid file type. Please upload a PNG, JPG, JPEG, or WEBP image.");
      return;
    }
    setFileError("");
    setBusy(true);
    try {
      const dataUrl = await downscale(file);
      const size = encodedBytes(dataUrl);
      if (size > MAX_ENCODED_BYTES) {
        setFileError("That image is still too large after resizing. Please try a smaller one.");
        return;
      }
      setMeta({ name: file.name, size: formatSize(size) });
      onChange(dataUrl);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setMeta(null);
    setFileError("");
    onChange("");
  };

  return (
    <div>
      <label className="field-label">{label} (PNG, JPG, WEBP)</label>
      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging ? "border-brand bg-brand/10" : "border-ink-200 hover:border-brand/60 bg-surface hover:bg-ink-100"
          }`}
        >
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => processFile(e.target.files?.[0])}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 mb-2">
            {busy ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          </div>
          <p className="text-[13px] font-medium text-ink">
            {busy ? "Preparing image…" : "Click to select or drag & drop image file"}
          </p>
          <p className="text-[11px] text-ink-400 mt-1">
            Supported formats: <span className="font-semibold text-ink-600">PNG, JPG, JPEG, WEBP</span>
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl border border-ink-200 overflow-hidden bg-ink-100">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="p-2.5 bg-card border-t border-ink-200/60 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-[12px] font-medium text-ink truncate">{meta?.name || "Current image"}</p>
              {meta?.size && <p className="text-[10.5px] text-ink-400">{meta.size}</p>}
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="px-2.5 py-1 text-[11.5px] font-medium text-danger hover:bg-danger/5 rounded-full transition-colors flex items-center gap-1 shrink-0"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      )}
      {fileError && <p className="text-danger text-[11.5px] mt-1.5">{fileError}</p>}
    </div>
  );
}
