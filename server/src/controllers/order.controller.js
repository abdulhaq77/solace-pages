import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Novel from "../models/Novel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkout = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.novel",
  );

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your cart is empty", 400));
  }

  let totalAmount = 0;
  const orderItems = cart.items.map((item) => {
    if (!item.novel || !item.novel.isAvailable) {
      throw new AppError("One or more items in your cart are unavailable", 400);
    }
    totalAmount += item.novel.price;
    return {
      novel: item.novel._id,
      priceAtPurchase: item.novel.price,
    };
  });

  // Create Order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: Number(totalAmount.toFixed(2)),
    paymentStatus: "completed",
  });

  // Increment sales count for novels & clear cart
  for (const item of cart.items) {
    await Novel.findByIdAndUpdate(item.novel._id, {
      $inc: { salesCount: 1, downloadCount: 1 },
    });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Checkout successful! Novels added to your library.",
    data: { order },
  });
});

export const getMyLibrary = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    paymentStatus: "completed",
  }).populate({
    path: "items.novel",
    select: "title author coverImage fileReference description price category",
  });

  // Extract unique novels owned by user
  const novelMap = new Map();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.novel && !novelMap.has(item.novel._id.toString())) {
        novelMap.set(item.novel._id.toString(), item.novel);
      }
    });
  });

  const libraryNovels = Array.from(novelMap.values());

  res.status(200).json({
    success: true,
    count: libraryNovels.length,
    data: { novels: libraryNovels },
  });
});

export const downloadNovel = asyncHandler(async (req, res, next) => {
  const { novelId } = req.params;

  // 1. Verify user owns the novel via a completed order
  const orders = await Order.find({
    user: req.user._id,
    paymentStatus: "completed",
  });
  let ownsNovel = false;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.novel.toString() === novelId) {
        ownsNovel = true;
      }
    });
  });

  if (!ownsNovel && req.user.role !== "admin") {
    return next(
      new AppError(
        "Unauthorized: You must purchase this novel before downloading.",
        403,
      ),
    );
  }

  const novel = await Novel.findById(novelId);
  if (!novel) {
    return next(new AppError("Novel not found", 404));
  }

  // 2. Return the secure Cloudinary URL directly to verified purchasers
  res.status(200).json({
    success: true,
    message: "Secure download authorization granted.",
    downloadUrl: novel.fileReference,
  });
});
