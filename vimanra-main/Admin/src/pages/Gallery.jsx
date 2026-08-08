import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, UploadCloud, X } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import FilterPills from "../components/FilterPills";
import { fetchGallery, addGalleryImage, deleteGalleryImage } from "../api";
import { SECTIONS, CATEGORIES, sectionLabel } from "../data/gallerySections";

const emptyForm = { title: "", section: "gallery", category: "Safari", url: "", fileName: "", fileSize: "" };

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery()
      .then(setImages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const processFile = (file) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setFileError("Invalid file type. Please upload a PNG, JPG, JPEG, or WEBP image.");
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      setForm((f) => ({
        ...f,
        url: e.target.result,
        fileName: file.name,
        fileSize: sizeStr,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const filtered = useMemo(
    () => (sectionFilter === "All" ? images : images.filter((i) => i.section === sectionFilter)),
    [images, sectionFilter]
  );

  const sectionOptions = useMemo(
    () => [
      { value: "All", label: "All", count: images.length },
      ...SECTIONS.map((s) => ({
        value: s.value,
        label: s.label,
        count: images.filter((i) => i.section === s.value).length,
      })),
    ],
    [images]
  );

  const removeImage = async (id) => {
    try {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    if (!form.url) {
      setFileError("Please select an image file.");
      return;
    }
    if (form.section === "gallery" && !form.title.trim()) {
      setFileError("Please give this photo a title.");
      return;
    }
    setSubmitting(true);
    try {
      const newImage = await addGalleryImage({
        title: form.section === "gallery" ? form.title.trim() : null,
        category: form.section === "gallery" ? form.category : null,
        url: form.url,
        section: form.section,
      });
      setImages((prev) => [newImage, ...prev]);
      setForm(emptyForm);
      setFileError("");
      setModalOpen(false);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Gallery" subtitle="Manage the homepage hero slideshow and the Resort Photo Gallery.">
        <p className="text-ink-400 text-[13px]">Loading gallery…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Gallery" subtitle="Manage the homepage hero slideshow and the Resort Photo Gallery.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <FilterPills options={sectionOptions} value={sectionFilter} onChange={setSectionFilter} />
        <button
          onClick={() => {
            setForm(emptyForm);
            setFileError("");
            setModalOpen(true);
          }}
          className="btn-primary self-start sm:self-auto shrink-0"
        >
          <Plus size={15} /> Add image
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <div key={img.id} className="group relative bg-card rounded-2xl border border-ink-200/70 shadow-soft overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-ink-100">
              <img src={img.url} alt={img.title || sectionLabel(img.section)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-3">
              <p className="text-[12.5px] font-medium text-ink truncate">{img.title || sectionLabel(img.section)}</p>
              {img.section === "gallery" && <p className="text-[11px] text-ink-400 mt-0.5">{img.category}</p>}
            </div>
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/80 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-ink-400 text-[13px] col-span-full text-center py-16">No images here yet.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a new image">
        <form onSubmit={submitImage} className="space-y-4">
          <div>
            <label className="field-label">Where should this appear?</label>
            <select
              value={form.section}
              onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
            >
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {form.section === "gallery" && (
            <>
              <div>
                <label className="field-label">Image title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Lakeside Deck at Dusk"
                  className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
                  required
                />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="field-label">Upload Image (PNG, JPG, WEBP)</label>

            {!form.url ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging
                    ? "border-brand bg-brand/10"
                    : "border-ink-200 hover:border-brand/60 bg-surface hover:bg-ink-100"
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 mb-2">
                  <UploadCloud size={20} />
                </div>
                <p className="text-[13px] font-medium text-ink">
                  Click to select or drag & drop image file
                </p>
                <p className="text-[11px] text-ink-400 mt-1">
                  Supported formats: <span className="font-semibold text-ink-600">PNG, JPG, JPEG, WEBP</span>
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl border border-ink-200 overflow-hidden bg-ink-100">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 bg-card border-t border-ink-200/60 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-[12px] font-medium text-ink truncate">{form.fileName}</p>
                    <p className="text-[10.5px] text-ink-400">{form.fileSize}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, url: "", fileName: "", fileSize: "" }))}
                    className="px-2.5 py-1 text-[11.5px] font-medium text-danger hover:bg-danger/5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            )}

            {fileError && (
              <p className="text-[11.5px] text-danger mt-1.5 font-medium">{fileError}</p>
            )}
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Uploading…" : "Add image"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
