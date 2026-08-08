import dbQuery from "../config/db.js";

export const getAllThingsToDo = async () => {
  return await dbQuery.all("THINGS_TO_DO");
};

export const getThingToDoById = async (id) => {
  return await dbQuery.get("THINGS_TO_DO", (t) => String(t.thing_id) === String(id));
};

export const createThingToDo = async (data) => {
  return await dbQuery.insert("THINGS_TO_DO", data, "thing_id");
};

export const updateThingToDo = async (id, data) => {
  return await dbQuery.update("THINGS_TO_DO", "thing_id", id, data);
};

export const deleteThingToDo = async (id) => {
  return await dbQuery.delete("THINGS_TO_DO", "thing_id", id);
};
