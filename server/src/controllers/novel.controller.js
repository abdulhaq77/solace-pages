import Novel from "../models/Novel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNovels = asyncHandler(async (req, res, next) => {
  let queryObj = { isAvailable: true };

  // 1. Filtering by category
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  // 2. Search by keyword/title/author
  if (req.query.search) {
    queryObj.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { author: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ];
  }

  // 3. Price filtering
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }

  let query = Novel.find(queryObj).populate("category", "name slug");

  // 4. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // Default newest first
  }

  // 5. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const novels = await query;
  const total = await Novel.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: novels.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: { novels },
  });
});

export const getNovelById = asyncHandler(async (req, res, next) => {
  const novel = await Novel.findById(req.params.id).populate(
    "category",
    "name slug",
  );
  if (!novel) {
    return next(new AppError("Novel not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: { novel },
  });
});

export const createNovel = asyncHandler(async (req, res, next) => {
  const newNovel = await Novel.create(req.body);
  res.status(201).json({
    success: true,
    data: { novel: newNovel },
  });
});

export const updateNovel = asyncHandler(async (req, res, next) => {
  const novel = await Novel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!novel) {
    return next(new AppError("Novel not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: { novel },
  });
});

export const deleteNovel = asyncHandler(async (req, res, next) => {
  const novel = await Novel.findByIdAndDelete(req.params.id);
  if (!novel) {
    return next(new AppError("Novel not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: null,
    message: "Novel deleted successfully",
  });
});
