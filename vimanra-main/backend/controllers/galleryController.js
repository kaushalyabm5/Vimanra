import {
  getAllGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../models/galleryModel.js";

const VALID_SECTIONS = ["gallery", "hero"];

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    const images = await getAllGallery();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve gallery items.", error: error.message });
  }
};

// @desc    Add new gallery image
// @route   POST /api/gallery
// @access  Private (Admin)
export const addGalleryItem = async (req, res) => {
  try {
    const { title, category, image_url } = req.body;
    const section = req.body.section || "gallery";

    if (!image_url) {
      return res.status(400).json({ message: "image_url is required." });
    }

    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ message: `section must be one of: ${VALID_SECTIONS.join(", ")}.` });
    }

    if (section === "gallery" && (!title || !category)) {
      return res.status(400).json({ message: "Title and category are required for gallery photos." });
    }

    const newItem = await createGallery({
      admin_id: req.user?.admin_id || 1,
      title: title || null,
      category: category || null,
      image_url,
      section,
      slot: null,
      uploaded_at: new Date().toISOString(),
    });

    res.status(201).json({ message: "Gallery item added successfully.", data: newItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to add gallery item.", error: error.message });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
export const editGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, image_url, section, slot } = req.body;

    const existing = await getGalleryById(id);
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    if (section !== undefined && !VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ message: `section must be one of: ${VALID_SECTIONS.join(", ")}.` });
    }

    const updated = await updateGallery(id, {
      ...(title && { title }),
      ...(category && { category }),
      ...(image_url && { image_url }),
      ...(section && { section }),
      ...(slot !== undefined && { slot: slot || null }),
    });

    res.status(200).json({ message: "Gallery item updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update gallery item.", error: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
export const removeGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteGallery(id);

    if (!deleted) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    res.status(200).json({ message: "Gallery item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gallery item.", error: error.message });
  }
};
