import {
  getAllThingsToDo,
  getThingToDoById,
  createThingToDo,
  updateThingToDo,
  deleteThingToDo,
} from "../models/thingToDoModel.js";

// @desc    Get all things to do
// @route   GET /api/things-to-do
// @access  Public
export const getThingsToDo = async (req, res) => {
  try {
    const items = await getAllThingsToDo();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve things to do.", error: error.message });
  }
};

// @desc    Add a new attraction
// @route   POST /api/things-to-do
// @access  Private (Admin)
export const addThingToDo = async (req, res) => {
  try {
    const { title, category, icon, distance, time, description, image_url } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required." });
    }

    const newItem = await createThingToDo({
      admin_id: req.user?.admin_id || 1,
      title,
      category: category || null,
      icon: icon || "Compass",
      distance: distance || null,
      time: time || null,
      description: description || "",
      image_url: image_url || null,
    });

    res.status(201).json({ message: "Attraction created and website updated.", data: newItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to create attraction.", error: error.message });
  }
};

// @desc    Edit an attraction
// @route   PUT /api/things-to-do/:id
// @access  Private (Admin)
export const editThingToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, icon, distance, time, description, image_url } = req.body;

    const existing = await getThingToDoById(id);
    if (!existing) {
      return res.status(404).json({ message: "Attraction not found." });
    }

    const updated = await updateThingToDo(id, {
      ...(title && { title }),
      ...(category !== undefined && { category }),
      ...(icon && { icon }),
      ...(distance !== undefined && { distance }),
      ...(time !== undefined && { time }),
      ...(description !== undefined && { description }),
      ...(image_url !== undefined && { image_url }),
    });

    res.status(200).json({ message: "Attraction updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update attraction.", error: error.message });
  }
};

// @desc    Delete an attraction
// @route   DELETE /api/things-to-do/:id
// @access  Private (Admin)
export const removeThingToDo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteThingToDo(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attraction not found." });
    }

    res.status(200).json({ message: "Attraction deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete attraction.", error: error.message });
  }
};
