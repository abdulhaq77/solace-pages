import Category from "../models/Category.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    count: categories.length,
    data: { categories },
  });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, image } = req.body;
  const newCategory = await Category.create({ name, description, image });
  res.status(201).json({
    success: true,
    data: { category: newCategory },
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("Category not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found with that ID", 404));
  }
  res.status(200).json({
    success: true,
    data: null,
    message: "Category deleted successfully",
  });
});
