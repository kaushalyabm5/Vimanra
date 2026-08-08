import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  UploadCloud,
  CheckCircle2,
  Waves,
  Trees,
  Utensils,
  Wifi,
  Car,
  Compass,
  PlaneTakeoff,
  ConciergeBell,
  Shirt,
  Sun,
  Users,
  Accessibility,
  Zap,
  Sparkles,
  Coffee,
  Binoculars,
  Bike,
} from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import FilterPills from "../components/FilterPills";
import { fetchFacilities, addFacility, updateFacility, deleteFacility } from "../api";

const STATUS_FILTERS = ["Active", "Inactive"];

export const FACILITY_ICONS = {
  Waves, Trees, Utensils, Wifi, Car, Compass, PlaneTakeoff, ConciergeBell,
  Shirt, Sun, Users, Accessibility, Zap, Sparkles, Coffee, Binoculars, Bike,
};
const ICON_OPTIONS = Object.keys(FACILITY_ICONS);

const emptyForm = {
  title: "",
  description: "",
  icon: "ConciergeBell",
  status: "Active",
  category: "",
  highlights: [""],
  image_url: "",
  fileName: "",
  fileSize: "",
};

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchFacilities()
      .then(setFacilities)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "All" ? facilities : facilities.filter((f) => f.status === statusFilter)),
    [facilities, statusFilter]
  );

  const statusOptions = useMemo(
    () => [
      { value: "All", label: "All", count: facilities.length },
      ...STATUS_FILTERS.map((s) => ({
        value: s,
        label: s,
        count: facilities.filter((f) => f.status === s).length,
      })),
    ],
    [facilities]
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditingId(f.id);
    setForm({
      title: f.title,
      description: f.description,
      icon: f.icon,
      status: f.status,
      category: f.category || "",
      highlights: f.highlights?.length ? f.highlights : [""],
      image_url: f.image_url || "",
      fileName: "",
      fileSize: "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const remove = async (id) => {
    try {
      await deleteFacility(id);
      setFacilities((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (id) => {
    const target = facilities.find((f) => f.id === id);
    if (!target) return;
    try {
      const updated = await updateFacility(id, { ...target, status: target.status === "Active" ? "Inactive" : "Active" });
      setFacilities((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ---- bullet points ----
  const addHighlight = () => setForm((f) => ({ ...f, highlights: [...f.highlights, ""] }));
  const updateHighlight = (idx, value) =>
    setForm((f) => ({ ...f, highlights: f.highlights.map((h, i) => (i === idx ? value : h)) }));
  const removeHighlight = (idx) =>
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, i) => i !== idx) }));

  // ---- image upload ----
  const processFile = (file) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setFormError("Invalid file type. Please upload a PNG, JPG, JPEG, or WEBP image.");
      return;
    }
    setFormError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      setForm((f) => ({ ...f, image_url: e.target.result, fileName: file.name, fileSize: sizeStr }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };
  const removeImage = () => setForm((f) => ({ ...f, image_url: "", fileName: "", fileSize: "" }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const payload = {
      ...form,
      highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
    };
    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateFacility(editingId, payload);
        setFacilities((prev) => prev.map((f) => (f.id === editingId ? updated : f)));
      } else {
        const created = await addFacility(payload);
        setFacilities((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Facilities" subtitle="Manage the Amenities & Facilities shown on the public website.">
        <p className="text-ink-400 text-[13px]">Loading facilities…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Facilities" subtitle="Manage the Amenities & Facilities shown on the public website.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <FilterPills options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        <button
          onClick={openAdd}
          className="btn-primary self-start sm:self-auto shrink-0"
        >
          <Plus size={15} /> Add facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f) => {
          const Icon = FACILITY_ICONS[f.icon] || ConciergeBell;
          return (
            <div key={f.id} className={`bg-card rounded-2xl border border-ink-200/70 shadow-soft overflow-hidden flex flex-col ${f.status === "Inactive" ? "opacity-60" : ""}`}>
              {f.image_url && (
                <div className="aspect-[16/9] w-full overflow-hidden bg-ink-100">
                  <img src={f.image_url} alt={f.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Icon size={19} className="text-brand-dark" />
                  </div>
                  <button
                    onClick={() => toggleStatus(f.id)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      f.status === "Active" ? "bg-brand/10 text-brand-dark" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {f.status}
                  </button>
                </div>
                {f.category && <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-400 mb-1">{f.category}</p>}
                <h3 className="text-[14.5px] font-semibold tracking-tight text-ink mb-1.5">{f.title}</h3>
                <p className="text-[12.5px] text-ink-600 leading-relaxed flex-1">{f.description}</p>
                {f.highlights?.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {f.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-[12px] text-ink-600">
                        <CheckCircle2 size={13} className="text-brand flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ink-200/70">
                  <button onClick={() => openEdit(f)} className="flex items-center gap-1.5 text-[12px] font-medium text-ink-600 hover:text-ink">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => remove(f.id)} className="flex items-center gap-1.5 text-[12px] font-medium text-danger/70 hover:text-danger">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-ink-400 text-[13px] col-span-full text-center py-16">No facilities found.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit facility" : "Add a new facility"}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Wellness"
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
            />
          </div>
          <div>
            <label className="field-label">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Spa & Massage Services"
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              required
            />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description shown on the public Facilities section"
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400 resize-none"
              required
            />
          </div>

          <div>
            <label className="field-label">Bullet points</label>
            <div className="space-y-2">
              {form.highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={h}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    placeholder="e.g. Professional therapists"
                    className="flex-1 rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    disabled={form.highlights.length === 1}
                    className="w-9 h-9 shrink-0 rounded-full border border-ink-200 flex items-center justify-center text-ink-500 hover:text-danger hover:border-danger/30 disabled:opacity-30 disabled:hover:text-ink-500 disabled:hover:border-ink-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-600 hover:text-ink"
            >
              <Plus size={14} /> Add bullet point
            </button>
          </div>

          <div>
            <label className="field-label">Image (PNG, JPG, WEBP)</label>
            {!form.image_url ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging ? "border-brand bg-brand/10" : "border-ink-200 hover:border-brand/60 bg-surface hover:bg-ink-100"
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
                <p className="text-[13px] font-medium text-ink">Click to select or drag & drop image file</p>
                <p className="text-[11px] text-ink-400 mt-1">
                  Supported formats: <span className="font-semibold text-ink-600">PNG, JPG, JPEG, WEBP</span>
                </p>
              </div>
            ) : (
              <div className="relative rounded-xl border border-ink-200 overflow-hidden bg-ink-100">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 bg-card border-t border-ink-200/60 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-[12px] font-medium text-ink truncate">{form.fileName || "Current image"}</p>
                    {form.fileSize && <p className="text-[10.5px] text-ink-400">{form.fileSize}</p>}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {formError && <p className="text-[11.5px] text-danger font-medium">{formError}</p>}

          <div className="flex items-center gap-2.5 pt-1">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add facility"}
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
