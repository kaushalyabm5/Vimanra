import { useEffect, useState } from "react";
import {
  MessageSquareText,
  Star,
} from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { fetchEnquiries, fetchReviews } from "../api";

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchEnquiries(), fetchReviews()])
      .then(([e, r]) => {
        if (!active) return;
        setEnquiries(e);
        setReviews(r);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Welcome back — here's how Vimanra is doing today.">
        <p className="text-ink-400 text-[13px]">Loading dashboard…</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard" subtitle="Welcome back — here's how Vimanra is doing today.">
        <p className="text-danger text-[13px]">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Welcome back — here's how Vimanra is doing today.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard icon={MessageSquareText} label="New enquiries" value={newEnquiries} delta="Awaiting response" deltaPositive={false} accent />
        <StatCard icon={Star} label="Average guest rating" value={`${avgRating} / 5`} delta={`${reviews.length} reviews`} />
      </div>

      <div className="mb-6">
        <div className="bg-card rounded-2xl border border-ink-200/70 shadow-soft p-5">
          <h3 className="text-[14.5px] font-semibold tracking-tight text-ink mb-4">Recent guest reviews</h3>
          <div className="space-y-4">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="pb-4 border-b border-ink-200/70 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-medium text-ink">{r.guestName}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className={i < r.rating ? "fill-brand-light stroke-none" : "text-ink-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-[12px] text-ink-500 leading-relaxed line-clamp-2">{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
