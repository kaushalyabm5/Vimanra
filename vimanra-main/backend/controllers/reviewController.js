import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../models/reviewModel.js";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public (approved only) or Private (Admin sees pending too)
export const getReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();

    // The public site only ever sees approved reviews. The dashboard sends a
    // token so it can also moderate submissions still waiting for approval.
    if (!req.user) {
      return res.status(200).json(reviews.filter((r) => r.visible !== false));
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reviews.", error: error.message });
  }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Admin) or the Google Form via its shared secret
export const addReview = async (req, res) => {
  try {
    const { guest_name, rating, review, source, visible } = req.body;
    const fromForm = req.reviewSource === "form";

    if (!guest_name || !rating || !review) {
      return res.status(400).json({ message: "guest_name, rating (1-5), and review text are required." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    const newReview = await createReview({
      admin_id: req.user?.admin_id || 1,
      guest_name,
      rating: numRating,
      review,
      // Guests cannot label or publish their own review: form submissions are
      // always attributed to the form and held back until an admin approves.
      source: fromForm ? "Google Form" : source || "Manual (Admin)",
      visible: fromForm ? false : visible !== undefined ? Boolean(visible) : true,
      created_at: new Date().toISOString(),
    });

    res.status(201).json({
      message: fromForm
        ? "Thank you! Your review will appear on the website once approved."
        : "Review saved and visible on website.",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review.", error: error.message });
  }
};

// @desc    Edit a review
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { guest_name, rating, review, source, visible } = req.body;

    const existing = await getReviewById(id);
    if (!existing) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
      }
    }

    const updated = await updateReview(id, {
      ...(guest_name && { guest_name }),
      ...(rating !== undefined && { rating: Number(rating) }),
      ...(review && { review }),
      ...(source && { source }),
      ...(visible !== undefined && { visible: Boolean(visible) }),
    });

    res.status(200).json({ message: "Review updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review.", error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteReview(id);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review.", error: error.message });
  }
};
