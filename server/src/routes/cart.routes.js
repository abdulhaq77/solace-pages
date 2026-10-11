import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route("/").get(getCart).post(addToCart);

router.delete("/:novelId", removeFromCart);

export default router;
