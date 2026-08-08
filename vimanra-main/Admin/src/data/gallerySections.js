// The Gallery page only manages photos for two public-site targets:
// - "hero": the homepage background slideshow (image only, no title/category)
// - "gallery": the Resort Photo Gallery section (title + category + image)
//
// Room / facility / attraction photos are edited directly on their own
// Admin page (Rooms / Facilities / Things To Do) via an Image URL field.

export const SECTIONS = [
  { value: "gallery", label: "Gallery" },
  { value: "hero", label: "Hero" },
];

export const CATEGORIES = ["Safari", "Hotel", "Rooms", "Pool", "Restaurant", "Nature", "Food", "Gardens"];

export const sectionLabel = (value) => SECTIONS.find((s) => s.value === value)?.label || value;
