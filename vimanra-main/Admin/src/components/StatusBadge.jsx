// Pill badges in the site's language: green for healthy/active states, neutral
// for resolved or archived ones, amber and red reserved for attention states.
const STYLES = {
  Confirmed: "bg-brand/10 text-brand-dark",
  "Checked In": "bg-ink-100 text-ink-800",
  "Checked Out": "bg-ink-100 text-ink-500",
  Pending: "bg-warning/10 text-warning",
  Cancelled: "bg-danger/10 text-danger",
  Paid: "bg-brand/10 text-brand-dark",
  Refunded: "bg-ink-100 text-ink-500",
  New: "bg-brand/10 text-brand-dark",
  Contacted: "bg-ink-100 text-ink-800",
  Closed: "bg-ink-100 text-ink-500",
  Active: "bg-brand/10 text-brand-dark",
  Inactive: "bg-ink-100 text-ink-500",
  Available: "bg-brand/10 text-brand-dark",
  Occupied: "bg-ink-100 text-ink-800",
  Maintenance: "bg-warning/10 text-warning",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "bg-ink-100 text-ink-500";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}
