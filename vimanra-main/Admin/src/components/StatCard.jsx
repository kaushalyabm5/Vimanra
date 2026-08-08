export default function StatCard({ icon: Icon, label, value, delta, deltaPositive = true, accent = false }) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-soft border ${
        accent
          ? "bg-ink border-ink text-white"
          : "bg-card border-ink-200/70 text-ink"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            accent ? "bg-brand-dark" : "bg-brand/10"
          }`}
        >
          <Icon size={18} className={accent ? "text-white" : "text-brand"} strokeWidth={2} />
        </div>
        {delta && (
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
            deltaPositive
              ? "bg-brand/10 text-brand-dark"
              : accent
                ? "bg-white/10 text-neutral-300"
                : "bg-ink-100 text-ink-500"
          }`}>
            {delta}
          </span>
        )}
      </div>
      <p className={`text-3xl font-light tracking-tight mt-4 ${accent ? "text-white" : "text-ink"}`}>{value}</p>
      <p className={`text-[12.5px] font-light mt-1 ${accent ? "text-neutral-400" : "text-ink-500"}`}>{label}</p>
    </div>
  );
}
