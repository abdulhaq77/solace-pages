import express from "express";

import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// register route
router.post("/register", register); // register route
router.post("/login", login); // login route
router.get("/me", protect, getMe); // get current user route
router.post("/logout", logout); // logout route

// Admin test route
router.get("/admin-test", protect, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted.",
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    },
  });
});

export default router;
