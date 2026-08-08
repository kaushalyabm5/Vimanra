import { API_BASE_URL } from "./client";

// Fetches every gallery row once; callers filter by `section`/`slot` locally
// since the admin-managed image set is small.
export async function fetchGalleryImages() {
  const res = await fetch(`${API_BASE_URL}/gallery`);
  if (!res.ok) throw new Error("Failed to load gallery images");
  return res.json();
}

// Images for a given section, oldest first (upload order), optionally
// narrowed to one slot (a specific room / facility / attraction).
export function imagesForSlot(images, section, slot) {
  return images
    .filter((img) => img.section === section && (slot ? img.slot === slot : true))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
