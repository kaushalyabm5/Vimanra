// Single source of truth for the external booking funnel. Every "Book" CTA on
// the site points here, so the affiliate id and label params stay intact no
// matter which button a guest clicks.
export const BOOKING_URL =
  'https://www.booking.com/searchresults.en-gb.html?aid=356980&label=gog235jc-10CAsohQFCEXZpbWFucmEtdWRhd2FsYXdhSDNYA2iFAYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgCl4WM0wbAAgHSAiRlZDFmMTkyZS03ZGUxLTQxYTgtYmUzZS1mMmRjOTY4M2Q1OTHYAgHgAgE&redirected=1&city=-2237982&highlighted_hotels=3320872&hlrd=user_sh&source=hotel&expand_sb=1&keep_landing=1&sid=1ae0fdfa046b04e6ea8b40ac93da7a1e';

// Spread onto any anchor that should open the booking funnel in a new tab.
export const BOOKING_LINK_PROPS = {
  href: BOOKING_URL,
  target: '_blank',
  rel: 'noopener noreferrer',
};
