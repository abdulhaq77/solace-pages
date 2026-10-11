import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../services/api.js";

export default function AIRecommendationWidget() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const res = await API.post("/ai/recommendations", {});
      setRecommendations(res.data.data.recommendations);
      setMessage(res.data.data.message);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Please sign in to receive personalized AI recommendations.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto my-12 rounded-2xl p-0.5 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.18)] bg-stone-800">
      {/* Framer Motion Rotating Google AI Beam Border Layer */}
      <div className="absolute inset-[-50%] pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_260deg,rgba(168,85,247,0.8)_300deg,rgba(251,191,36,1)_330deg,rgba(255,255,255,1)_360deg)]"
        />
      </div>

      {/* Inner Card Content */}
      <div className="relative bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 rounded-2xl p-8 z-10 space-y-6">
        {/* Decorative ambient background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-200 text-[10px] uppercase tracking-[0.3em] font-semibold px-2.5 py-1 rounded-full mb-2">
              Solace AI Curator
            </span>
            <h3 className="text-2xl font-serif text-amber-100 tracking-wide">
              Discover Your Next Chapter
            </h3>
            <p className="text-stone-400 text-xs mt-1">
              Let our intelligent assistant curate novels based on your reading
              history and literary tastes.
            </p>
          </div>
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="bg-amber-100 text-stone-950 px-6 py-3 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Curating..." : "Generate Recommendations"}
          </button>
        </div>

        {message && (
          <p className="relative z-10 text-stone-300 text-xs italic border-l-2 border-amber-400 pl-3">
            {message}
          </p>
        )}

        {recommendations && (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-800/80">
            {recommendations.length === 0 ? (
              <p className="text-stone-400 text-xs col-span-3 text-center py-4">
                No unowned recommendations available right now. You might own
                our top picks!
              </p>
            ) : (
              recommendations.map((novel) => (
                <Link
                  key={novel._id}
                  to={`/novel/${novel._id}`}
                  className="group/card bg-stone-950/80 border border-stone-800 hover:border-amber-400/60 rounded-xl p-4 flex items-center space-x-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                >
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="w-12 h-16 object-cover rounded shadow-md group-hover/card:scale-105 transition duration-300"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-serif text-amber-100 text-sm truncate group-hover/card:text-amber-200 transition">
                      {novel.title}
                    </h4>
                    <p className="text-stone-400 text-[10px] mt-0.5">
                      {novel.author}
                    </p>
                    <p className="text-amber-200 font-mono text-xs mt-1 font-semibold">
                      ${novel.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
