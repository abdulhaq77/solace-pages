import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await API.get("/categories")).data.data.categories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["novels", search, selectedCategory, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sort) params.append("sort", sort);
      const res = await API.get(`/novels?${params.toString()}`);
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-amber-100">Novel Catalog</h1>
          <p className="text-stone-400 text-xs mt-1">
            Browse our complete collection of downloadable digital novels.
          </p>
        </div>

        {/* Search & Sort controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-stone-900 border border-stone-800 text-stone-200 px-4 py-2 rounded text-xs focus:outline-none focus:border-amber-200/50"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-stone-900 border border-stone-800 text-stone-200 px-3 py-2 rounded text-xs focus:outline-none"
          >
            <option value="-createdAt">Newest Releases</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Categories
          </h3>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setSelectedCategory("")}
              className={`text-left px-3 py-2 rounded text-xs transition ${!selectedCategory ? "bg-amber-100/10 text-amber-200 font-semibold" : "text-stone-400 hover:text-stone-200"}`}
            >
              All Categories
            </button>
            {categoriesData?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`text-left px-3 py-2 rounded text-xs transition ${selectedCategory === cat._id ? "bg-amber-100/10 text-amber-200 font-semibold" : "text-stone-400 hover:text-stone-200"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Novels Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-stone-900 h-80 rounded-xl animate-pulse border border-stone-800"
                />
              ))}
            </div>
          ) : data?.data?.novels?.length === 0 ? (
            <div className="text-center py-20 bg-stone-900/40 rounded-xl border border-stone-800">
              <p className="text-stone-400 text-sm">
                No novels found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data?.data?.novels?.map((novel) => (
                <Link
                  key={novel._id}
                  to={`/novel/${novel._id}`}
                  className="group bg-stone-900 border border-stone-800 rounded-xl overflow-hidden flex flex-col hover:border-stone-700 transition"
                >
                  <div className="h-64 bg-stone-950 overflow-hidden relative">
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col grow justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-amber-100 text-lg group-hover:text-amber-200 transition line-clamp-1">
                        {novel.title}
                      </h3>
                      <p className="text-stone-400 text-xs mt-1">
                        {novel.author}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                      <span className="text-amber-200 font-mono font-semibold">
                        ${novel.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-stone-500 uppercase tracking-wider">
                        Downloadable
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
