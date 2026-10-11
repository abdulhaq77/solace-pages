import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import API from "../../services/api.js";

export const novelSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.any().refine((files) => files?.[0] instanceof File, {
    message: "Cover image file is required",
  }),
  fileReference: z.any().refine((files) => files?.[0] instanceof File, {
    message: "E-novel PDF file is required",
  }),
});

export default function AddNovelForm({
  onSubmitMutation,
  isPending,
  successMessage,
  errorMessage,
}) {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(novelSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: "",
      category: "",
    },
  });

  // Fetch categories from database on load to populate dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/api/categories");
        setCategories(response.data.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Watch file fields for live preview rendering
  const coverImageFiles = watch("coverImage");
  const fileReferenceFiles = watch("fileReference");

  const coverFile = coverImageFiles?.[0];
  const pdfFile = fileReferenceFiles?.[0];

  // Generate temporary object URL for cover preview image
  const coverPreviewUrl = coverFile ? URL.createObjectURL(coverFile) : null;

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    if (data.coverImage?.[0]) {
      formData.append("coverImage", data.coverImage[0]);
    }
    if (data.fileReference?.[0]) {
      formData.append("novelFile", data.fileReference[0]);
    }

    onSubmitMutation(formData, () => reset());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-xs font-mono">
          {successMessage}
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded text-xs font-mono">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Novel Title *
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="e.g., Neon Horizon"
            className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
          {errors.title && (
            <span className="text-[10px] text-rose-400 font-mono">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Author *
          </label>
          <input
            type="text"
            {...register("author")}
            placeholder="e.g., Lyra Chen"
            className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
          {errors.author && (
            <span className="text-[10px] text-rose-400 font-mono">
              {errors.author.message}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Price ($ USD) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="11.99"
            className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
          />
          {errors.price && (
            <span className="text-[10px] text-rose-400 font-mono">
              {errors.price.message}
            </span>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Category *
          </label>
          <select
            {...register("category")}
            className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          >
            <option value="">
              {isLoadingCategories
                ? "Loading categories..."
                : "Select Category"}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-[10px] text-rose-400 font-mono">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
          Synopsis / Description *
        </label>
        <textarea
          rows="4"
          {...register("description")}
          placeholder="Provide a compelling summary of the e-novel (at least 10 characters)..."
          className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
        />
        {errors.description && (
          <span className="text-[10px] text-rose-400 font-mono">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* File Uploads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-800">
        {/* Cover Image Upload & Live Preview */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Cover Artwork Image *
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("coverImage")}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs text-stone-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-amber-200 hover:file:bg-stone-700 cursor-pointer"
          />
          {errors.coverImage ? (
            <span className="text-[10px] text-rose-400 font-mono block">
              {errors.coverImage.message}
            </span>
          ) : (
            <span className="text-[10px] text-stone-500 font-mono block">
              Required: High-res portrait JPEG/PNG.
            </span>
          )}

          {coverPreviewUrl && (
            <div className="flex items-center gap-3 p-2 bg-stone-950 border border-stone-800 rounded">
              <img
                src={coverPreviewUrl}
                alt="Cover Preview"
                className="w-10 h-14 object-cover rounded border border-stone-700"
              />
              <div className="overflow-hidden">
                <p className="text-[11px] font-medium text-stone-200 truncate">
                  {coverFile?.name}
                </p>
                <p className="text-[10px] font-mono text-amber-300">
                  Ready ({(coverFile.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Digital Novel File Upload & Live Preview */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-300">
            Digital E-Book File (PDF) *
          </label>
          <input
            type="file"
            accept=".pdf,.epub,.mobi"
            {...register("fileReference")}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs text-stone-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-amber-200 hover:file:bg-stone-700 cursor-pointer"
          />
          {errors.fileReference ? (
            <span className="text-[10px] text-rose-400 font-mono block">
              {errors.fileReference.message}
            </span>
          ) : (
            <span className="text-[10px] text-stone-500 font-mono block">
              Required: Securely delivered PDF file.
            </span>
          )}

          {pdfFile && (
            <div className="flex items-center gap-3 p-2.5 bg-stone-950 border border-stone-800 rounded">
              <div className="w-8 h-10 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 text-[10px] font-mono font-bold shrink-0">
                PDF
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-medium text-stone-200 truncate">
                  {pdfFile.name}
                </p>
                <p className="text-[10px] font-mono text-amber-300">
                  Attached ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="bg-amber-100 hover:bg-amber-200 text-stone-950 px-6 py-3 rounded text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting || isPending
            ? "Publishing Novel..."
            : "Publish to Storefront Catalog"}
        </button>
      </div>
    </form>
  );
}
