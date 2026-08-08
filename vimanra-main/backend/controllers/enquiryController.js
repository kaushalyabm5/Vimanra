import {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
} from "../models/enquiryModel.js";

const VALID_STATUSES = ["New", "Contacted", "Closed"];

// @desc    Submit an enquiry (public contact form / WhatsApp button)
// @route   POST /api/enquiries
// @access  Public
export const addEnquiry = async (req, res) => {
  try {
    const { name, email, phone, channel, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email, and message are required." });
    }

    const newEnquiry = await createEnquiry({
      name,
      email,
      phone: phone || null,
      channel: channel || "Contact Form",
      message,
      status: "New",
    });

    res.status(201).json({ message: "Enquiry received. We will contact you shortly.", data: newEnquiry });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit enquiry.", error: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await getAllEnquiries();
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve enquiries.", error: error.message });
  }
};

// @desc    Update an enquiry's status and/or reply message
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
export const editEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply_message } = req.body;

    const existing = await getEnquiryById(id);
    if (!existing) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}.` });
    }

    const updated = await updateEnquiry(id, {
      ...(status && { status }),
      ...(reply_message !== undefined && { reply_message }),
    });

    res.status(200).json({ message: "Enquiry updated successfully.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update enquiry.", error: error.message });
  }
};
