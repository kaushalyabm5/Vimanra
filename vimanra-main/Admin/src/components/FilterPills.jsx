/**
 * A row of filter pills, each showing how many items sit under it.
 *
 * Counts are passed in by the page rather than computed here, so they can be
 * derived from the same list the page is about to render — the number on a
 * pill always matches what clicking it will show.
 *
 * `size="sm"` matches the compact pills used inside the Enquiries sidebar;
 * the default matches the standalone filter rows on the content pages.
 */
export default function FilterPills({ options, value, onChange, size = "md", className = "" }) {
  const sizing = size === "sm" ? "px-2.5 py-1.5 text-[11.5px]" : "px-3.5 py-2 text-[12.5px]";
  const inactive =
    size === "sm"
      ? "text-ink-500 hover:bg-ink-100"
      : "bg-card text-ink-600 border border-ink-200 hover:bg-ink-100";

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 ${className}`}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`${sizing} rounded-full font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1.5 shrink-0 ${
              active ? "bg-ink text-white" : inactive
            }`}
          >
            {opt.label}
            <span
              className={`min-w-[16px] px-1 rounded-full text-[10px] font-semibold leading-[15px] text-center tabular-nums ${
                active ? "bg-white/25 text-white" : "bg-ink-100 text-ink-500"
              }`}
            >
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
