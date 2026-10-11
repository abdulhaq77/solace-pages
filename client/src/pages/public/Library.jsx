import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function Library() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["library"],
    queryFn: async () => (await API.get("/orders/library")).data.data.novels,
  });

  const handleDownload = async (novelId, title) => {
    try {
      const res = await API.get(`/orders/download/${novelId}`);
      if (res.data.downloadUrl) {
        alert(`Downloading "${title}" from: ${res.data.downloadUrl}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to download novel.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-32 text-amber-500 animate-pulse text-sm">
        Loading your digital library...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-4">
        <p className="text-rose-400 text-sm">
          Please sign in to access your digital library.
        </p>
        <Link
          to="/login"
          className="inline-block bg-amber-100 text-stone-950 px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const novels = data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-3xl font-serif text-amber-100">
          My Digital Library
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Your permanent sanctuary of purchased novels and downloadable ebooks.
        </p>
      </div>

      {novels.length === 0 ? (
        <div className="text-center py-24 bg-stone-900/40 rounded-xl border border-stone-800 space-y-4">
          <p className="text-stone-400 text-sm">
            Your library is currently empty. Explore our catalog to add your
            first novel.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-amber-100 text-stone-950 px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {novels.map((novel) => (
            <div
              key={novel._id}
              className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-64 bg-stone-950 overflow-hidden relative">
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-amber-100 text-lg line-clamp-1">
                    {novel.title}
                  </h3>
                  <p className="text-stone-400 text-xs">{novel.author}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleDownload(novel._id, novel.title)}
                  className="w-full bg-stone-800 text-amber-100 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-100 hover:text-stone-950 transition border border-stone-700"
                >
                  Download Ebook
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
