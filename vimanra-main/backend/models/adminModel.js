import dbQuery from "../config/db.js";

export const findAdminByUsername = async (username) => {
  return await dbQuery.get("ADMINS", (admin) => admin.username === username);
};

export const findAdminById = async (id) => {
  return await dbQuery.get("ADMINS", (admin) => String(admin.admin_id) === String(id));
};

export const createAdmin = async (adminData) => {
  return await dbQuery.insert("ADMINS", adminData, "admin_id");
};

export const updateAdminPassword = async (id, passwordHash) => {
  return await dbQuery.update("ADMINS", "admin_id", id, {
    password_hash: passwordHash,
    updated_at: new Date().toISOString(),
  });
};
