// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect routes — verify JWT
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      const message =
        error.name === "TokenExpiredError"
          ? "Session expired. Please login again."
          : "Not authorized. Invalid token.";
      return res.status(401).json({ message });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ✅ Admin-only access
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.warn(`Unauthorized admin access attempt by ${req.user?.email || "unknown user"}`);
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

// ✅ Superadmin-only access
export const superadmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    console.warn(`Unauthorized superadmin access attempt by ${req.user?.email || "unknown user"}`);
    res.status(403).json({ message: "Not authorized as superadmin" });
  }
};

// ✅ Flexible role checker (for future use)
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};