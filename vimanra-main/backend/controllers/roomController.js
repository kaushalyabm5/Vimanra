import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomPrice,
  deleteRoom,
} from "../models/roomModel.js";

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve rooms.", error: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve room details.", error: error.message });
  }
};

// @desc    Update Room Price (Room Price Management Flow)
// @route   PUT /api/rooms/:id/price
// @access  Private (Admin)
export const editRoomPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    // Step: Select Room check
    const existing = await getRoomById(id);
    if (!existing) {
      return res.status(404).json({ message: "Validation Failed: Room not found." });
    }

    // Step: Validation
    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({ message: "Validation Error: Price must be a valid numeric value." });
    }

    const numPrice = Number(price);
    if (numPrice <= 0) {
      return res.status(400).json({ message: "Validation Error: Price must be greater than zero." });
    }

    // Step: Save & Database Updated
    const updatedRoom = await updateRoomPrice(id, numPrice);

    // Step: Finish & Sync
    res.status(200).json({
      message: "Database Updated: Website shows new price.",
      data: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update room price.", error: error.message });
  }
};

// @desc    Update full room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin)
export const editRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_type, subtitle, price, capacity, description, image_url, status, features } = req.body;

    const existing = await getRoomById(id);
    if (!existing) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
      return res.status(400).json({ message: "Validation Error: Price must be a positive number." });
    }

    const updated = await updateRoom(id, {
      ...(room_type && { room_type }),
      ...(subtitle !== undefined && { subtitle }),
      ...(price !== undefined && { price: Number(price) }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(description !== undefined && { description }),
      ...(image_url !== undefined && { image_url }),
      ...(status && { status }),
      ...(Array.isArray(features) && { features }),
    });

    res.status(200).json({ message: "Room updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update room details.", error: error.message });
  }
};

// @desc    Add a new room
// @route   POST /api/rooms
// @access  Private (Admin)
export const addRoom = async (req, res) => {
  try {
    const { room_type, subtitle, price, capacity, description, image_url, status, features } = req.body;

    if (!room_type || price === undefined) {
      return res.status(400).json({ message: "room_type and price are required." });
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ message: "Validation Error: Price must be a positive number." });
    }

    const newRoom = await createRoom({
      room_type,
      subtitle: subtitle || null,
      price: Number(price),
      capacity: capacity !== undefined ? Number(capacity) : 1,
      description: description || "",
      image_url: image_url || null,
      status: status || "Available",
      features: Array.isArray(features) ? features : [],
    });

    res.status(201).json({ message: "Room created and website updated.", data: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Failed to create room.", error: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
export const removeRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRoom(id);

    if (!deleted) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.status(200).json({ message: "Room deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room.", error: error.message });
  }
};
