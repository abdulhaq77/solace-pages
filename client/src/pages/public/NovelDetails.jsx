import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function NovelDetails() {
  const { id } = useParams();

  const {
    data: novel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["novel", id],
    queryFn: async () => (await API.get(`/novels/${id}`)).data.data.novel,
  });

  if (isLoading) {
    return (
      <div className="text-center py-32 text-amber-500 animate-pulse text-sm">
        Loading novel details...
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="text-center py-32 space-y-4">
        <p className="text-rose-400 text-sm">
          Novel not found or failed to load.
        </p>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest text-amber-200 underline"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Cover Image */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden h-[450px]">
          <img
            src={novel.coverImage}
            alt={novel.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details & Purchase Action */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-200/80 font-semibold">
              {novel.category?.name || "Literature"}
            </span>
            <h1 className="text-4xl font-serif text-amber-100 mt-2">
              {novel.title}
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              By{" "}
              <span className="text-stone-200 font-medium">{novel.author}</span>
            </p>
          </div>

          <div className="text-2xl font-mono text-amber-200 font-semibold">
            ${novel.price.toFixed(2)}
          </div>

          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">
            {novel.description}
          </p>

          <div className="border-t border-stone-800 pt-6 grid grid-cols-2 gap-4 text-xs text-stone-400">
            <div>
              <strong className="text-stone-200">Language:</strong>{" "}
              {novel.language || "English"}
            </div>
            <div>
              <strong className="text-stone-200">Pages:</strong>{" "}
              {novel.pages || "N/A"}
            </div>
            <div>
              <strong className="text-stone-200">Published Year:</strong>{" "}
              {novel.publishedYear || "N/A"}
            </div>
            <div>
              <strong className="text-stone-200">Format:</strong> Digital
              Download (PDF/EPUB)
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button className="bg-amber-100 text-stone-950 px-8 py-3.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 transition shadow-lg">
              Add to Cart
            </button>
            <span className="text-xs text-stone-500 italic">
              Secure instant file delivery after purchase.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
