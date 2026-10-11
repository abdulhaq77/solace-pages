import express from "express";
import {
  checkout,
  getMyLibrary,
  downloadNovel,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/checkout", checkout); // Checkout route
router.get("/library", getMyLibrary); // Get user's library route
router.get("/download/:novelId", downloadNovel); // Download novel route

export default router;
