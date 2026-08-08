import { useEffect, useMemo, useState } from "react";
import { Star, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { fetchReviews, addReview, updateReview, deleteReview as deleteReviewApi } from "../api";
import { useCounts } from "../context/CountsContext";

function StarInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)}>
          <Star size={22} className={n <= value ? "fill-brand-light stroke-none" : "text-ink-300"} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ guestName: "", rating: 5, review: "" });
  const { refreshCounts } = useCounts();

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return reviews;
    if (filter === "Visible") return reviews.filter((r) => r.visible);
    if (filter === "Hidden") return reviews.filter((r) => !r.visible);
    return reviews.filter((r) => String(r.rating) === filter);
  }, [reviews, filter]);

  const toggleVisible = async (id, visible) => {
    try {
      const updated = await updateReview(id, { visible: !visible });
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      refreshCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeReview = async (id) => {
    try {
      await deleteReviewApi(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      refreshCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!form.guestName.trim() || !form.review.trim()) return;
    try {
      const newReview = await addReview({
        guestName: form.guestName.trim(),
        rating: form.rating,
        review: form.review.trim(),
      });
      setReviews((prev) => [newReview, ...prev]);
      setForm({ guestName: "", rating: 5, review: "" });
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1);
  const pendingCount = reviews.filter((r) => !r.visible).length;

  if (loading) {
    return (
      <Layout title="Reviews" subtitle="Approve guest submissions and manage what's shown on the website.">
        <p className="text-ink-400 text-[13px]">Loading reviews…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Reviews" subtitle="Approve guest submissions and manage what's shown on the website.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-ink-200/70 rounded-xl px-4 py-2.5 shadow-soft flex items-center gap-2">
            <Star size={16} className="fill-brand-light stroke-none" />
            <span className="text-[14px] font-semibold tracking-tight text-ink">{avgRating}</span>
            <span className="text-[12px] text-ink-400">avg · {reviews.length} reviews</span>
          </div>
          {pendingCount > 0 && (
            <button
              onClick={() => setFilter("Hidden")}
              className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-2.5 shadow-soft flex items-center gap-2 whitespace-nowrap hover:bg-brand/20 transition-colors"
            >
              <EyeOff size={15} className="text-brand" />
              <span className="text-[14px] font-semibold tracking-tight text-ink">{pendingCount}</span>
              <span className="text-[12px] text-ink-500">awaiting approval</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["All", "Visible", "Hidden", "5", "4", "3"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors ${
                  filter === f ? "bg-ink text-white" : "bg-card text-ink-600 border border-ink-200"
                }`}
              >
                {f === "5" || f === "4" || f === "3" ? `${f}★` : f}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus size={15} /> Add review manually
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className={`bg-card rounded-2xl border border-ink-200/70 shadow-soft p-5 flex flex-col ${!r.visible ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[14px] font-medium text-ink">{r.guestName}</p>
                <p className="text-[11px] text-ink-400 mt-0.5">{r.source} · {r.date}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r.rating ? "fill-brand-light stroke-none" : "text-ink-300"} />
                ))}
              </div>
            </div>
            <p className="text-[13px] text-ink-600 leading-relaxed flex-1">{r.review}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-200/70">
              <button
                onClick={() => toggleVisible(r.id, r.visible)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-ink-600 hover:text-ink"
              >
                {r.visible ? <><Eye size={14} /> Visible on site</> : <><EyeOff size={14} /> Hidden</>}
              </button>
              <button
                onClick={() => removeReview(r.id)}
                className="text-danger/70 hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-ink-400 text-[13px] col-span-full text-center py-16">No reviews match this filter.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a guest review manually">
        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="field-label">Guest name</label>
            <input
              value={form.guestName}
              onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
              placeholder="e.g. Hannah Fischer"
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400"
              required
            />
          </div>
          <div>
            <label className="field-label">Rating</label>
            <StarInput value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
          </div>
          <div>
            <label className="field-label">Review</label>
            <textarea
              rows={4}
              value={form.review}
              onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
              placeholder="What did the guest say about their stay?"
              className="w-full rounded-xl border border-ink-200 bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-ink-400 resize-none"
              required
            />
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Publish review
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
