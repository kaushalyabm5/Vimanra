import jwt from "jsonwebtoken";
import crypto from "crypto";

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || "vimanra_secret");

const safeEqual = (a, b) => {
  const provided = Buffer.from(String(a));
  const expected = Buffer.from(String(b));
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
};

export const protectAdmin = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "vimanra_secret");
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid or expired token." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

// Attaches req.user when a valid admin token is present. Used by public reads
// that return extra rows to admins.
export const optionalAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No credentials at all is just the public website, which is fine.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  // A caller that does present a token is told when it has expired. Falling
  // through as a visitor instead would quietly hand the dashboard the shorter
  // public list, making pending reviews look like they had never arrived.
  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token." });
  }
};

// Review submissions come from two places: an admin using the dashboard, and
// the public Google Form relayed by Apps Script. Anything else is rejected so
// the endpoint cannot be used to publish straight onto the website.
export const identifyReviewSource = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(authHeader.split(" ")[1]);
      req.reviewSource = "admin";
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid or expired token." });
    }
  }

  const expected = process.env.REVIEW_FORM_SECRET;
  const provided = req.headers["x-form-secret"];

  if (expected && provided && safeEqual(provided, expected)) {
    req.reviewSource = "form";
    return next();
  }

  return res.status(401).json({ message: "Not authorized to submit a review." });
};
