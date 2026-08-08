import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone, MessageCircle, Check, Archive } from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import FilterPills from "../components/FilterPills";
import { fetchEnquiries, updateEnquiry } from "../api";
import { useCounts } from "../context/CountsContext";

const TABS = ["All", "New", "Contacted", "Closed"];

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const { refreshCounts } = useCounts();

  useEffect(() => {
    fetchEnquiries()
      .then((rows) => {
        setEnquiries(rows);
        setActiveId(rows[0]?.id ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Search is applied first so the tab counts describe the current search,
  // not the whole inbox — otherwise a pill could promise more than it shows.
  const searched = useMemo(() => {
    const q = query.toLowerCase();
    return enquiries.filter(
      (e) => e.name.toLowerCase().includes(q) || e.message.toLowerCase().includes(q)
    );
  }, [enquiries, query]);

  const filtered = useMemo(
    () => (tab === "All" ? searched : searched.filter((e) => e.status === tab)),
    [searched, tab]
  );

  const tabOptions = useMemo(
    () =>
      TABS.map((t) => ({
        value: t,
        label: t,
        count: t === "All" ? searched.length : searched.filter((e) => e.status === t).length,
      })),
    [searched]
  );

  const active = enquiries.find((e) => e.id === activeId) || filtered[0];

  useEffect(() => {
    setError("");
  }, [activeId]);

  const setStatus = async (id, status) => {
    try {
      const updated = await updateEnquiry(id, { status });
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      refreshCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Enquiries" subtitle="Messages from the contact form and WhatsApp button.">
        <p className="text-ink-400 text-[13px]">Loading enquiries…</p>
      </Layout>
    );
  }

  return (
    <Layout title="Enquiries" subtitle="Messages from the contact form and WhatsApp button.">
      {error && <p className="text-danger text-[12.5px] mb-3">{error}</p>}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[380px] shrink-0 bg-card rounded-2xl border border-ink-200/70 shadow-soft flex flex-col overflow-hidden">
          <div className="p-4 border-b border-ink-200/70 space-y-3">
            <div className="flex items-center gap-2 bg-surface border border-ink-200 rounded-full px-4 py-2 focus-within:border-brand transition-colors">
              <Search size={14} className="text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search enquiries…"
                className="bg-transparent outline-none text-[13px] text-ink placeholder:text-ink-400 w-full"
              />
            </div>
            <FilterPills options={tabOptions} value={tab} onChange={setTab} size="sm" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[560px]">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveId(e.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-ink-200/60 transition-colors ${
                  active?.id === e.id ? "bg-brand/10" : "hover:bg-surface/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-medium text-ink truncate">{e.name}</p>
                  {e.status === "New" && <span className="w-2 h-2 rounded-full bg-brand shrink-0" />}
                </div>
                <p className="text-[12px] text-ink-500 line-clamp-1">{e.message}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10.5px] text-ink-400">{e.channel} · {e.date}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-ink-400 text-[13px] py-10">No enquiries found.</p>
            )}
          </div>
        </div>

        <div className="flex-1 bg-card rounded-2xl border border-ink-200/70 shadow-soft p-6">
          {active ? (
            <div className="max-w-2xl">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight text-ink">{active.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12.5px] text-ink-600">
                    <a href={`mailto:${active.email}`} className="flex items-center gap-1.5 hover:text-brand-dark transition-colors">
                      <Mail size={13} /> {active.email}
                    </a>
                    {active.phone && (
                      <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 hover:text-brand-dark transition-colors">
                        <Phone size={13} /> {active.phone}
                      </a>
                    )}
                  </div>
                </div>
                <StatusBadge status={active.status} />
              </div>

              <div className="bg-surface rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 text-[11.5px] text-ink-400 mb-2">
                  <MessageCircle size={13} /> {active.channel} · {active.date}
                </div>
                <p className="text-[13.5px] text-ink-700 leading-relaxed">{active.message}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setStatus(active.id, "Contacted")}
                  disabled={active.status === "Contacted"}
                  className="btn-primary text-[12.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} />
                  {active.status === "Contacted" ? "Marked as contacted" : "Mark as contacted"}
                </button>
                <button
                  onClick={() => setStatus(active.id, "Closed")}
                  className="btn-ghost text-[12.5px]"
                >
                  <Archive size={14} /> Close enquiry
                </button>
              </div>
            </div>
          ) : (
            <p className="text-ink-400 text-[13px]">Select an enquiry to view details.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
