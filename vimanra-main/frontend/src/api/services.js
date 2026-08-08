import { API_BASE_URL } from "./client";

export async function fetchServices() {
  const res = await fetch(`${API_BASE_URL}/services`);
  if (!res.ok) throw new Error("Failed to load services");
  return res.json();
}
