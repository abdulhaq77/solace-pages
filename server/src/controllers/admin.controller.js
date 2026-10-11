import Novel from "../models/Novel.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Admin-only route to fetch dashboard statistics (novels, users, orders, revenue)
export const getAdminStats = asyncHandler(async (req, res, next) => {
  const totalNovels = await Novel.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments({
    paymentStatus: "completed",
  });

  const orders = await Order.find({ paymentStatus: "completed" });
  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0,
  );

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalNovels,
        totalUsers,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
    },
  });
});

// Admin-only route to create a new novel in the catalog
export const createNovelAdmin = asyncHandler(async (req, res, next) => {
  const { title, author, description, price, category, isAvailable } = req.body;

  // Prevent duplicate novel uploads (case-insensitive check on title + author)
  const existingNovel = await Novel.findOne({
    title: { $regex: new RegExp(`^${title}$`, "i") },
    author: { $regex: new RegExp(`^${author}$`, "i") },
  });

  if (existingNovel) {
    return next(
      new AppError(
        "A novel with this exact title and author already exists in the catalog.",
        400,
      ),
    );
  }

  // Grab the hosted cloud URLs provided by multer-storage-cloudinary
  const coverImage = req.files?.coverImage
    ? req.files.coverImage[0].path
    : req.body.coverImage;
  const fileReference = req.files?.fileReference
    ? req.files.fileReference[0].path
    : "https://res.cloudinary.com/demo/raw/upload/sample.pdf";

  const novel = await Novel.create({
    title,
    author,
    description,
    price,
    category,
    coverImage,
    fileReference,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
  });

  res.status(201).json({
    success: true,
    message: "Novel uploaded to Cloudinary and published successfully!",
    data: { novel },
  });
});

// Admin-only route to update novel details in the catalog
export const updateNovelAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const novel = await Novel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!novel) {
    return next(new AppError("Novel not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Novel updated successfully.",
    data: { novel },
  });
});

// Admin-only route to delete a novel from the catalog
export const deleteNovelAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const novel = await Novel.findByIdAndDelete(id);

  if (!novel) {
    return next(new AppError("Novel not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Novel removed from catalog.",
  });
});

// Admin-only route to fetch all registered users (excluding passwords)
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password"); // Exclude password field for security
  res.status(200).json({
    success: true,
    data: { users },
  });
});
