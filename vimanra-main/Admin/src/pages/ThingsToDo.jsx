import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  Binoculars,
  HeartHandshake,
  Waves,
  Landmark,
  Sparkles,
  Bike,
  Trees,
  Compass,
} from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import ImageUploadField from "../components/ImageUploadField";
import FilterPills from "../components/FilterPills";
import { fetchThingsToDo, addThingToDo, updateThingToDo, deleteThingToDo } from "../api";

// Attractions carry a free-text category, so there is no fixed list to filter
// on — the pills are built from whatever categories the data actually uses.
const UNCATEGORISED = "__none__";

export const THING_ICONS = { Eye, Binoculars, HeartHandshake, Waves, Landmark, Sparkles, Bike, Trees, Compass };
const ICON_OPTIONS = Object.keys(THING_ICONS);

const emptyForm = { title: "", category: "", icon: "Compass", distance: "", time: "", description: "", image: "" };

export default function ThingsToDo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchThingsToDo()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (categoryFilter === "All") return items;
    if (categoryFilter === UNCATEGORISED) return items.filter((t) => !t.category);
    return items.filter((t) => t.category === categoryFilter);
  }, [items, categoryFilter]);

  const categoryOptions = useMemo(() => {
    const named = [...new Set(items.map((t) => t.category).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );
    const uncategorised = items.filter((t) => !t.category).length;
    return [
      { value: "All", label: "All", count: items.length },
      ...named.map((c) => ({
        value: c,
        label: c,
        count: items.filter((t) => t.category === c).length,
      })),
      // Only offered when such items exist, so the pill counts always add up.
      ...(uncategorised
        ? [{ value: UNCATEGORISED, label: "Uncategorised", count: uncategorised }]
        : []),
    ];
  }, [items]);

  // A category can disappear when its last item is edited or removed.
  useEffect(() => {
    if (!categoryOptions.some((o) => o.value === categoryFilter)) setCategoryFilter("All");
  }, [categoryOptions, categoryFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      category: t.category,
      icon: t.icon,
      distance: t.distance,
      time: t.time,
      description: t.description,
      image: t.image,
    });
    setModalOpen(true);
  };

  const remove = async (id) => {
    try {
      await deleteThingToDo(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      if (editingId) {
        const updated = await updateThingToDo(editingId, form);
        setItems((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await addThingToDo(form);
        setItems((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Things To Do" subtitle="Manage local attractions shown on the public website.">
        <p className="text-ink-400 text-[13px]">Loading attractions…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Things To Do" subtitle="Manage local attractions shown on the public website.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <FilterPills options={categoryOptions} value={categoryFilter} onChange={setCategoryFilter} />
        <button
          onClick={openAdd}
          className="btn-primary self-start sm:self-auto shrink-0"
        >
          <Plus size={15} /> Add attraction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const Icon = THING_ICONS[t.icon] || Compass;
          return (
            <div key={t.id} className="bg-card rounded-2xl border border-ink-200/70 shadow-soft overflow-hidden flex flex-col">
              <div className="aspect-[16/9] w-full overflow-hidden bg-ink-100">
                {t.image && <img src={t.image} alt={t.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-dark" />
                  </div>
                  {t.category && (
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-ink-100 text-ink-500">{t.category}</span>
                  )}
                </div>
                <h3 className="text-[14.5px] font-semibold tracking-tight text-ink mb-1">{t.title}</h3>
                <p className="text-[11.5px] text-ink-400 mb-2">{t.distance}{t.distance && t.time ? " · " : ""}{t.time}</p>
                <p className="text-[12.5px] text-ink-600 leading-relaxed flex-1">{t.description}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ink-200/70">
                  <button onClick={() => openEdit(t)} className="flex items-center gap-1.5 text-[12px] font-medium text-ink-600 hover:text-ink">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => remove(t.id)} className="flex items-center gap-1.5 text-[12px] font-medium text-danger/70 hover:text-danger">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-ink-400 text-[13px] col-span-full text-center py-16">No attractions found.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit attraction" : "Add a new attraction"}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Udawalawe National Park Safari"
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
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all resize-none"
            />
          </div>
          <ImageUploadField
            value={form.image}
            onChange={(image) => setForm((f) => ({ ...f, image }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Wildlife Safari"
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              />
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Distance</label>
              <input
                value={form.distance}
                onChange={(e) => setForm((f) => ({ ...f, distance: e.target.value }))}
                placeholder="e.g. 12 km"
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              />
            </div>
            <div>
              <label className="field-label">Travel time</label>
              <input
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="e.g. 20 mins"
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <button type="submit" className="btn-primary flex-1">
              {editingId ? "Save changes" : "Add attraction"}
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
