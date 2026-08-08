import dbQuery from "../config/db.js";

export const getAllReviews = async () => {
  return await dbQuery.all("REVIEWS");
};

export const getReviewById = async (id) => {
  return await dbQuery.get("REVIEWS", (r) => String(r.review_id) === String(id));
};

export const createReview = async (reviewData) => {
  return await dbQuery.insert("REVIEWS", reviewData, "review_id");
};

export const updateReview = async (id, reviewData) => {
  return await dbQuery.update("REVIEWS", "review_id", id, reviewData);
};

export const deleteReview = async (id) => {
  return await dbQuery.delete("REVIEWS", "review_id", id);
};
