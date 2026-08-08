import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../models/serviceModel.js";

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve services.", error: error.message });
  }
};

// @desc    Add a new service
// @route   POST /api/services
// @access  Private (Admin)
export const addService = async (req, res) => {
  try {
    const { service_name, description, icon, status, category, highlights, image_url } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: "service_name is required." });
    }

    const newService = await createService({
      admin_id: req.user?.admin_id || 1,
      service_name,
      description: description || "",
      icon: icon || "ConciergeBell",
      status: status || "Active",
      category: category || null,
      highlights: Array.isArray(highlights) ? highlights : [],
      image_url: image_url || null,
    });

    res.status(201).json({ message: "Service created and website updated.", data: newService });
  } catch (error) {
    res.status(500).json({ message: "Failed to create service.", error: error.message });
  }
};

// @desc    Edit an existing service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, description, icon, status, category, highlights, image_url } = req.body;

    const existing = await getServiceById(id);
    if (!existing) {
      return res.status(404).json({ message: "Service not found." });
    }

    const updated = await updateService(id, {
      ...(service_name && { service_name }),
      ...(description !== undefined && { description }),
      ...(icon && { icon }),
      ...(status && { status }),
      ...(category !== undefined && { category }),
      ...(Array.isArray(highlights) && { highlights }),
      ...(image_url !== undefined && { image_url }),
    });

    res.status(200).json({ message: "Service updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update service.", error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const removeService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service.", error: error.message });
  }
};
