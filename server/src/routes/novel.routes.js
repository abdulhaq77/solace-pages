import express from "express";
import {
  getNovels,
  getNovelById,
  createNovel,
  updateNovel,
  deleteNovel,
} from "../controllers/novel.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getNovels).post(protect, requireAdmin, createNovel);

router
  .route("/:id")
  .get(getNovelById)
  .put(protect, requireAdmin, updateNovel)
  .delete(protect, requireAdmin, deleteNovel);

export default router;
