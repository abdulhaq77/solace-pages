import express from "express";
import {
  getAdminStats,
  createNovelAdmin,
  updateNovelAdmin,
  deleteNovelAdmin,
  getAllUsers,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictToAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(protect, restrictToAdmin); // Secure all admin routes

router.get("/stats", getAdminStats); // Admin dashboard statistics
router.post("/novels", createNovelAdmin); // Create a new novel (admin only)
router.get("/users", getAllUsers); // Get all users (admin only)
router.put("/novels/:id", updateNovelAdmin); // Update a novel (admin only)
router.delete("/novels/:id", deleteNovelAdmin); // Delete a novel (admin only)

export default router;
