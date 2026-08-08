import dbQuery from "../config/db.js";

export const getAllServices = async () => {
  return await dbQuery.all("SERVICES");
};

export const getServiceById = async (id) => {
  return await dbQuery.get("SERVICES", (s) => String(s.service_id) === String(id));
};

export const createService = async (serviceData) => {
  return await dbQuery.insert("SERVICES", serviceData, "service_id");
};

export const updateService = async (id, serviceData) => {
  return await dbQuery.update("SERVICES", "service_id", id, serviceData);
};

export const deleteService = async (id) => {
  return await dbQuery.delete("SERVICES", "service_id", id);
};
