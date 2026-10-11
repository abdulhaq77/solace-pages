import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";
import AIRecommendationWidget from "../../components/ai/AIRecommendationWidget.jsx";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-novels"],
    queryFn: async () => {
      const res = await API.get("/novels?limit=4");
      return res.data.data.novels;
    },
  });

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-6 pt-12">
        <span className="text-amber-200/80 text-xs uppercase tracking-[0.3em] font-semibold">
          Digital Literary Marketplace
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-amber-100 tracking-tight leading-none">
          Where Stories Find Their Sanctuary.
        </h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-base font-light leading-relaxed">
          Explore curated digital novels and timeless ebooks. Purchase securely,
          build your permanent library, and immerse yourself in unforgettable
          worlds.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/shop"
            className="bg-amber-100 text-stone-950 px-8 py-3.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 transition shadow-lg"
          >
            Explore Catalog
          </Link>
        </div>
      </section>

      {/* AI Recommendation Widget */}
      <div className="max-w-7xl mx-auto px-6">
        <AIRecommendationWidget />
      </div>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-end border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-2xl font-serif text-amber-100">
              Featured Releases
            </h2>
            <p className="text-stone-400 text-xs mt-1">
              Handpicked literary masterpieces available for immediate download.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-amber-200 hover:text-amber-100 font-semibold"
          >
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-stone-900 h-80 rounded-xl animate-pulse border border-stone-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data?.map((novel) => (
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
                      Instant PDF
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
