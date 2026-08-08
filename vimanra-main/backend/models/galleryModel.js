import dbQuery from "../config/db.js";

export const getAllGallery = async () => {
  return await dbQuery.all("GALLERY");
};

export const getGalleryById = async (id) => {
  return await dbQuery.get("GALLERY", (g) => String(g.image_id) === String(id));
};

export const createGallery = async (galleryData) => {
  return await dbQuery.insert("GALLERY", galleryData, "image_id");
};

export const updateGallery = async (id, galleryData) => {
  return await dbQuery.update("GALLERY", "image_id", id, galleryData);
};

export const deleteGallery = async (id) => {
  return await dbQuery.delete("GALLERY", "image_id", id);
};
