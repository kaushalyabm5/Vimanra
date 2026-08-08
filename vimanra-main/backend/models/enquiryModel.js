import dbQuery from "../config/db.js";

export const getAllEnquiries = async () => {
  const rows = await dbQuery.all("ENQUIRIES");
  return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getEnquiryById = async (id) => {
  return await dbQuery.get("ENQUIRIES", (e) => String(e.enquiry_id) === String(id));
};

export const createEnquiry = async (enquiryData) => {
  return await dbQuery.insert("ENQUIRIES", enquiryData, "enquiry_id");
};

export const updateEnquiry = async (id, enquiryData) => {
  return await dbQuery.update("ENQUIRIES", "enquiry_id", id, enquiryData);
};
