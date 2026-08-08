# Vimanra Hotel — Admin Dashboard (Frontend)

A frontend-only admin dashboard for Vimanra Hotel, built with React + Vite + Tailwind CSS.
All data is mock/in-memory (see `src/data/mockData.js`) — there is no backend yet, so changes
reset on page reload. This is meant as the UI/UX foundation to wire up to a real API later.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Demo login

- Username: `admin`
- Password: `vimanra2026`

## What's included

- **Login** — simple username/password gate (session-only, resets on browser close)
- **Dashboard** — key stats, revenue trend, today's occupancy, upcoming reservations, recent reviews
- **Analyze** — revenue, bookings by room type, bookings by channel, weekly occupancy charts
- **Reservations** — searchable/filterable booking list, per-booking detail panel with status updates
  (Pending → Confirmed → Checked In → Checked Out / Cancelled)
- **Payments** — payment ledger with totals collected/pending/refunded, mark-as-paid action
- **Enquiries** — inbox-style contact form / WhatsApp enquiries with reply + close actions
- **Reviews** — guest review cards with a "add review manually" form, show/hide toggle, delete
- **Gallery** — categorized image grid with an "add image" form (URL-based placeholder for upload)
- **Services** — CRUD-style cards for hotel services/facilities with active/inactive toggle

## Design tokens

| Token | Hex |
|---|---|
| Primary (Navy) | `#0F172A` |
| Secondary (Slate Blue) | `#1E293B` |
| Accent (Gold) | `#D4AF37` |
| Background | `#F8FAFC` |
| Cards | `#FFFFFF` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |

Font: **Poppins** (loaded via Google Fonts in `index.html`).

## Next steps to make this production-ready

- Replace mock data + AuthContext with real API calls (auth, reservations, payments, etc.)
- Add proper password hashing / session handling on a real backend (see the security gap
  flagged in the project analysis document)
- Wire the Gallery "Add image" form to real file upload/storage instead of a URL field
- Add pagination for large data sets (reservations, payments, enquiries)
