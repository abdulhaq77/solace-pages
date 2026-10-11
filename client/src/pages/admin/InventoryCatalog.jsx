import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function InventoryCatalog() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch novels inventory data
  const { data: novelsData, isLoading: novelsLoading } = useQuery({
    queryKey: ["novels-catalog"],
    queryFn: async () => (await API.get("/novels")).data.data.novels,
  });

  // Mutation to delete a novel from inventory
  const deleteMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/admin/novels/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["novels-catalog"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete novel");
    },
  });

  // Extract unique categories for filtering
  const categories = [
    "All",
    ...new Set(novelsData?.map((n) => n.category?.name || n.category) || []),
  ];

  // Filter novels by category and search term
  const filteredNovels = novelsData?.filter((novel) => {
    const categoryName = novel.category?.name || novel.category;
    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch =
      novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Context Header */}
      <div className="border-b border-stone-800 pb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-200">
          Catalog Control
        </span>
        <h1 className="text-3xl font-serif text-amber-100 mt-1">
          Inventory Management
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Search, filter categories, or remove e-novels from the active
          storefront catalog.
        </p>
      </div>

      {/* FIXED SEARCH & HEADER BAR */}
      <div className="sticky top-16 z-20 bg-stone-950/95 backdrop-blur-md pt-2 pb-4 border-b border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-300">
            Catalog Items ({filteredNovels?.length || 0})
          </h3>

          {/* Search Bar */}
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded px-4 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* MOBILE: Horizontal Scrollable Chips on Top */}
        <div className="flex lg:hidden overflow-x-auto space-x-2 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? "bg-amber-100 text-stone-950 border-amber-100"
                  : "bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* DESKTOP: Fixed Vertical Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 bg-stone-900/60 border border-stone-800 rounded-xl p-4 sticky top-28">
          <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-4 font-semibold px-2">
            Filter Categories
          </h4>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition ${
                  selectedCategory === cat
                    ? "bg-amber-100/10 text-amber-200 font-medium border border-amber-400/30"
                    : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Novels List Area */}
        <div className="lg:col-span-3 bg-stone-900/40 border border-stone-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-stone-800">
            {novelsLoading ? (
              <div className="p-12 text-center text-stone-500 text-xs font-mono">
                Loading inventory catalog...
              </div>
            ) : filteredNovels?.length === 0 ? (
              <div className="p-12 text-center text-stone-500 text-xs">
                No novels found matching your criteria.
              </div>
            ) : (
              filteredNovels?.map((novel) => (
                <div
                  key={novel._id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-stone-900/80 transition"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="w-12 h-16 object-cover rounded border border-stone-800 shrink-0"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f";
                      }}
                    />
                    <div>
                      <h4 className="font-serif text-amber-100 text-sm">
                        {novel.title}
                      </h4>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {novel.author} •{" "}
                        <span className="font-mono text-amber-200">
                          ${novel.price.toFixed(2)}
                        </span>
                      </p>
                      <span className="inline-block mt-2 text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                        {novel.category?.name || novel.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${novel.title}"?`,
                        )
                      ) {
                        deleteMutation.mutate(novel._id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="bg-stone-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-stone-400 px-4 py-2 rounded text-xs uppercase tracking-wider transition font-semibold border border-stone-700/60 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
