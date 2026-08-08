import { API_BASE_URL } from "./client";

export async function fetchRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`);
  if (!res.ok) throw new Error("Failed to load rooms");
  return res.json();
}
