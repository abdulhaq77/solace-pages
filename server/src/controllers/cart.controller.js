import Cart from "../models/Cart.js";
import Novel from "../models/Novel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.novel",
    select: "title author price coverImage fileReference isAvailable",
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Calculate total price
  const total = cart.items.reduce((acc, item) => {
    return acc + (item.novel ? item.novel.price : 0);
  }, 0);

  res.status(200).json({
    success: true,
    data: {
      cart,
      total: Number(total.toFixed(2)),
    },
  });
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { novelId } = req.body;

  const novel = await Novel.findById(novelId);
  if (!novel || !novel.isAvailable) {
    return next(
      new AppError("Novel not found or unavailable for purchase", 404),
    );
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ novel: novelId }],
    });
  } else {
    // Check if item already exists in cart
    const itemExists = cart.items.some(
      (item) => item.novel.toString() === novelId,
    );
    if (itemExists) {
      return next(new AppError("Novel is already in your cart", 400));
    }
    cart.items.push({ novel: novelId });
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: "Novel added to cart successfully",
  });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { novelId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter((item) => item.novel.toString() !== novelId);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
});
