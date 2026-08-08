import { API_BASE_URL } from "./client";

export async function fetchReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json();
}
