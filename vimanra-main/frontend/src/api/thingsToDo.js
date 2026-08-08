import { API_BASE_URL } from "./client";

export async function fetchThingsToDo() {
  const res = await fetch(`${API_BASE_URL}/things-to-do`);
  if (!res.ok) throw new Error("Failed to load things to do");
  return res.json();
}
