import dbQuery from "../config/db.js";

export const getAllRooms = async () => {
  return await dbQuery.all("ROOMS");
};

export const getRoomById = async (id) => {
  return await dbQuery.get("ROOMS", (room) => String(room.room_id) === String(id));
};

export const createRoom = async (roomData) => {
  return await dbQuery.insert("ROOMS", roomData, "room_id");
};

export const updateRoom = async (id, roomData) => {
  return await dbQuery.update("ROOMS", "room_id", id, roomData);
};

export const updateRoomPrice = async (id, newPrice) => {
  return await dbQuery.update("ROOMS", "room_id", id, { price: Number(newPrice) });
};

export const deleteRoom = async (id) => {
  return await dbQuery.delete("ROOMS", "room_id", id);
};
