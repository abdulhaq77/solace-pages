import { getAIPRecommendations, getAISummary } from "../services/ai.service.js";
import Order from "../models/Order.js";
import Novel from "../models/Novel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const fetchAIRecommendations = asyncHandler(async (req, res, next) => {
  // Fetch user's purchased novels to build preference profile
  const orders = await Order.find({
    user: req.user._id,
    paymentStatus: "completed",
  }).populate("items.novel");
  const userLibrary = [];
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.novel) userLibrary.push(item.novel);
    });
  });

  const result = await getAIPRecommendations(req.body, userLibrary);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const fetchAISummary = asyncHandler(async (req, res, next) => {
  const { novelId } = req.params;
  const novel = await Novel.findById(novelId);

  if (!novel) {
    return next(new AppError("Novel not found", 404));
  }

  const result = await getAISummary(novel.title, novel.description);

  res.status(200).json({
    success: true,
    data: result,
  });
});
