import express from "express";

import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import novelRoutes from "./novel.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import aiRoutes from "./ai.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/auth", authRoutes); // All authentication routes
router.use("/categories", categoryRoutes); // All category routes
router.use("/novels", novelRoutes); // All novel routes
router.use("/cart", cartRoutes); // All cart routes
router.use("/orders", orderRoutes); // All order routes
router.use("/ai", aiRoutes); // All AI-related routes
router.use("/admin", adminRoutes); // All admin routes

export default router;
