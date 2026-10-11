import mongoose from "mongoose";

const novelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Novel title is required"],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL/path is required"],
    },
    fileReference: {
      type: String,
      required: [true, "Ebook file reference is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Novel must belong to a category"],
      index: true,
    },
    tags: [String],
    keywords: [String],
    language: {
      type: String,
      default: "English",
    },
    pages: {
      type: Number,
    },
    publishedYear: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search performance
novelSchema.index({
  title: "text",
  author: "text",
  description: "text",
  tags: "text",
});

const Novel = mongoose.model("Novel", novelSchema);
export default Novel;
