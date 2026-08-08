import { apiRequest, setToken, clearToken } from "./client";

// ---------- Auth ----------

export async function login(username, password) {
  const data = await apiRequest("/auth/login", { method: "POST", body: { username, password } });
  setToken(data.token);
  return data.admin;
}

export function logout() {
  clearToken();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await apiRequest("/auth/password", {
    method: "PUT",
    auth: true,
    body: { current_password: currentPassword, new_password: newPassword },
  });
  return res.message;
}

// ---------- Rooms ----------

export async function fetchRooms() {
  return await apiRequest("/rooms");
}

export async function updateRoom(id, { room_type, subtitle, price, capacity, description, image_url, status, features }) {
  const res = await apiRequest(`/rooms/${id}`, {
    method: "PUT",
    auth: true,
    body: { room_type, subtitle, price, capacity, description, image_url, status, features },
  });
  return res.data;
}

export async function updateRoomPrice(id, price) {
  const res = await apiRequest(`/rooms/${id}/price`, { method: "PUT", auth: true, body: { price } });
  return res.data;
}

export async function createRoom({ room_type, subtitle, price, capacity, description, image_url, status, features }) {
  const res = await apiRequest("/rooms", {
    method: "POST",
    auth: true,
    body: { room_type, subtitle, price, capacity, description, image_url, status, features },
  });
  return res.data;
}

export async function deleteRoom(id) {
  await apiRequest(`/rooms/${id}`, { method: "DELETE", auth: true });
}

// ---------- Facilities ----------
// Backed by the "services" table/API — this is also the public site's
// "Amenities & Facilities" section.

const adaptFacility = (s) => ({
  id: s.service_id,
  title: s.service_name,
  description: s.description,
  icon: s.icon,
  status: s.status,
  category: s.category || "",
  highlights: s.highlights || [],
  image_url: s.image_url || "",
});

export async function fetchFacilities() {
  const rows = await apiRequest("/services");
  return rows.map(adaptFacility);
}

export async function addFacility({ title, description, icon, status, category, highlights, image_url }) {
  const res = await apiRequest("/services", {
    method: "POST",
    auth: true,
    body: { service_name: title, description, icon, status, category, highlights, image_url },
  });
  return adaptFacility(res.data);
}

export async function updateFacility(id, { title, description, icon, status, category, highlights, image_url }) {
  const res = await apiRequest(`/services/${id}`, {
    method: "PUT",
    auth: true,
    body: { service_name: title, description, icon, status, category, highlights, image_url },
  });
  return adaptFacility(res.data);
}

export async function deleteFacility(id) {
  await apiRequest(`/services/${id}`, { method: "DELETE", auth: true });
}

// ---------- Gallery ----------

const adaptGalleryImage = (g) => ({
  id: g.image_id,
  title: g.title,
  category: g.category,
  url: g.image_url,
  section: g.section || "gallery",
  date: (g.created_at || "").slice(0, 10),
});

export async function fetchGallery() {
  const rows = await apiRequest("/gallery");
  return rows.map(adaptGalleryImage);
}

export async function addGalleryImage({ title, category, url, section }) {
  const res = await apiRequest("/gallery", {
    method: "POST",
    auth: true,
    body: { title, category, image_url: url, section },
  });
  return adaptGalleryImage(res.data);
}

export async function deleteGalleryImage(id) {
  await apiRequest(`/gallery/${id}`, { method: "DELETE", auth: true });
}

// ---------- Reviews ----------

const adaptReview = (r) => ({
  id: r.review_id,
  guestName: r.guest_name,
  rating: r.rating,
  review: r.review,
  source: r.source,
  visible: r.visible,
  date: (r.created_at || "").slice(0, 10),
});

// Sends the token so the response includes reviews still awaiting approval —
// without it the API returns only what is already live on the public site.
export async function fetchReviews() {
  const rows = await apiRequest("/reviews", { auth: true });
  return rows.map(adaptReview);
}

export async function addReview({ guestName, rating, review }) {
  const res = await apiRequest("/reviews", {
    method: "POST",
    auth: true,
    body: { guest_name: guestName, rating, review },
  });
  return adaptReview(res.data);
}

export async function updateReview(id, { visible, guestName, rating, review, source }) {
  const res = await apiRequest(`/reviews/${id}`, {
    method: "PUT",
    auth: true,
    body: {
      ...(guestName !== undefined && { guest_name: guestName }),
      ...(rating !== undefined && { rating }),
      ...(review !== undefined && { review }),
      ...(source !== undefined && { source }),
      ...(visible !== undefined && { visible }),
    },
  });
  return adaptReview(res.data);
}

export async function deleteReview(id) {
  await apiRequest(`/reviews/${id}`, { method: "DELETE", auth: true });
}

// ---------- Enquiries ----------

const adaptEnquiry = (e) => ({
  id: e.enquiry_id,
  name: e.name,
  email: e.email,
  phone: e.phone,
  channel: e.channel,
  message: e.message,
  status: e.status,
  date: (e.created_at || "").slice(0, 10),
});

export async function fetchEnquiries() {
  const rows = await apiRequest("/enquiries", { auth: true });
  return rows.map(adaptEnquiry);
}

export async function updateEnquiry(id, { status }) {
  const res = await apiRequest(`/enquiries/${id}`, {
    method: "PUT",
    auth: true,
    body: { ...(status !== undefined && { status }) },
  });
  return adaptEnquiry(res.data);
}

// ---------- Things To Do ----------

const adaptThingToDo = (t) => ({
  id: t.thing_id,
  title: t.title,
  category: t.category || "",
  icon: t.icon,
  distance: t.distance || "",
  time: t.time || "",
  description: t.description || "",
  image: t.image_url || "",
});

export async function fetchThingsToDo() {
  const rows = await apiRequest("/things-to-do");
  return rows.map(adaptThingToDo);
}

export async function addThingToDo({ title, category, icon, distance, time, description, image }) {
  const res = await apiRequest("/things-to-do", {
    method: "POST",
    auth: true,
    body: { title, category, icon, distance, time, description, image_url: image },
  });
  return adaptThingToDo(res.data);
}

export async function updateThingToDo(id, { title, category, icon, distance, time, description, image }) {
  const res = await apiRequest(`/things-to-do/${id}`, {
    method: "PUT",
    auth: true,
    body: { title, category, icon, distance, time, description, image_url: image },
  });
  return adaptThingToDo(res.data);
}

export async function deleteThingToDo(id) {
  await apiRequest(`/things-to-do/${id}`, { method: "DELETE", auth: true });
}
