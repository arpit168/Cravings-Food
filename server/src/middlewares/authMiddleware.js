import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const Protect = async (req, res, next) => {
  try {
    let token = req.cookies?.parleG;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Unauthorized! Please Login First.");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key_for_dev_only",
    );
    if (!decoded || !decoded.id) {
      const error = new Error("Invalid Token! Please Login Again.");
      error.statusCode = 401;
      return next(error);
    }

    const verifiedUser = await User.findById(decoded.id).select("-password");
    if (!verifiedUser) {
      const error = new Error("User associated with token no longer exists.");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Session expired or invalid token. Please log in again.";
    }
    next(error);
  }
};

export const AuthorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error(
        `Access Denied! Role '${req.user?.role || "guest"}' is not authorized to access this resource.`,
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
