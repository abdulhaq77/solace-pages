import express from "express";
import {
  fetchAIRecommendations,
  fetchAISummary,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/recommendations", protect, fetchAIRecommendations);
router.get("/summary/:novelId", fetchAISummary);

export default router;
