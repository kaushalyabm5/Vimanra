import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import ImageUploadField from "../components/ImageUploadField";
import FilterPills from "../components/FilterPills";
import { fetchRooms, updateRoom, createRoom, deleteRoom } from "../api";

const STATUS_OPTIONS = ["Available", "Occupied", "Maintenance"];

const emptyForm = { room_type: "", subtitle: "", price: "", capacity: 2, description: "", image_url: "", status: "Available", features: "" };

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "All" ? rooms : rooms.filter((r) => r.status === statusFilter)),
    [rooms, statusFilter]
  );

  const statusOptions = useMemo(
    () => [
      { value: "All", label: "All", count: rooms.length },
      ...STATUS_OPTIONS.map((s) => ({
        value: s,
        label: s,
        count: rooms.filter((r) => r.status === s).length,
      })),
    ],
    [rooms]
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditingId(r.room_id);
    setForm({
      room_type: r.room_type,
      subtitle: r.subtitle || "",
      price: r.price,
      capacity: r.capacity,
      description: r.description || "",
      image_url: r.image_url || "",
      status: r.status,
      features: (r.features || []).join(", "),
    });
    setModalOpen(true);
  };

  const remove = async (id) => {
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.room_id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.room_type.trim() || !form.price) return;
    const payload = {
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        const updated = await updateRoom(editingId, payload);
        setRooms((prev) => prev.map((r) => (r.room_id === editingId ? updated : r)));
      } else {
        const created = await createRoom(payload);
        setRooms((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Rooms" subtitle="Manage the rooms shown on the public Accommodation section.">
        <p className="text-ink-400 text-[13px]">Loading rooms…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Rooms" subtitle="Manage the rooms shown on the public Accommodation section.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <FilterPills options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        <button
          onClick={openAdd}
          className="btn-primary self-start sm:self-auto shrink-0"
        >
          <Plus size={15} /> Add room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.room_id} className="bg-card rounded-2xl border border-ink-200/70 shadow-soft overflow-hidden flex flex-col">
            <div className="aspect-[16/9] w-full overflow-hidden bg-ink-100">
              {r.image_url && (
                <img src={r.image_url} alt={r.room_type} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2 gap-2">
                <div>
                  <h3 className="text-[14.5px] font-semibold tracking-tight text-ink">{r.room_type}</h3>
                  {r.subtitle && <p className="text-[11.5px] text-ink-400 mt-0.5">{r.subtitle}</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-[12.5px] text-ink-600 leading-relaxed flex-1">{r.description}</p>
              {r.features?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {r.features.map((f) => (
                    <span key={f} className="text-[10.5px] font-medium text-ink-600 bg-ink-100 px-2 py-1 rounded-md">{f}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-200/70">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold tracking-tight text-ink">${r.price}</span>
                  <span className="flex items-center gap-1 text-[12px] text-ink-500">
                    <Users size={13} /> {r.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => openEdit(r)} className="flex items-center gap-1.5 text-[12px] font-medium text-ink-600 hover:text-ink">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => remove(r.room_id)} className="flex items-center gap-1.5 text-[12px] font-medium text-danger/70 hover:text-danger">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-ink-400 text-[13px] col-span-full text-center py-16">No rooms found.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit room" : "Add a new room"}>
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">Room type</label>
              <input
                value={form.room_type}
                onChange={(e) => setForm((f) => ({ ...f, room_type: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                required
              />
            </div>
            <div>
              <label className="field-label">Subtitle</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. Garden View"
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              />
            </div>
            <div>
              <label className="field-label">Features (comma separated)</label>
              <input
                value={form.features}
                onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                placeholder="e.g. Queen Bed, Free WiFi, Balcony"
                className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
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
              value={form.image_url}
              onChange={(image_url) => setForm((f) => ({ ...f, image_url }))}
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="field-label">Price ($)</label>
                <input
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                  required
                />
              </div>
              <div>
                <label className="field-label">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                  required
                />
              </div>
              <div>
                <label className="field-label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? "Save changes" : "Add room"}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
}
