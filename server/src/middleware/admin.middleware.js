import { AppError } from "../utils/AppError.js";

export const restrictToAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(
      new AppError("Access denied: Administrator privileges required.", 403),
    );
  }
  next();
};
