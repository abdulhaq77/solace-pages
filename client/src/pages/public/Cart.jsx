import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function Cart() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => (await API.get("/cart")).data.data,
  });

  const removeMutation = useMutation({
    mutationFn: async (novelId) => await API.delete(`/cart/${novelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-32 text-amber-500 animate-pulse text-sm">
        Loading your cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-4">
        <p className="text-rose-400 text-sm">
          Please sign in to view your shopping cart.
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

  const items = data?.cart?.items || [];
  const total = data?.total || 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-3xl font-serif text-amber-100">Shopping Cart</h1>
        <p className="text-stone-400 text-xs mt-1">
          Review your selected digital novels before proceeding to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-stone-900/40 rounded-xl border border-stone-800 space-y-4">
          <p className="text-stone-400 text-sm">
            Your cart is currently empty.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-amber-100 text-stone-950 px-6 py-2.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const novel = item.novel;
              if (!novel) return null;
              return (
                <div
                  key={novel._id}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-serif text-amber-100 text-base">
                        {novel.title}
                      </h3>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {novel.author}
                      </p>
                      <p className="text-amber-200 font-mono text-xs mt-2">
                        ${novel.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(novel._id)}
                    className="text-stone-500 hover:text-rose-400 text-xs uppercase tracking-wider transition font-semibold p-2"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 h-fit space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-semibold border-b border-stone-800 pb-3">
              Order Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Subtotal</span>
              <span className="font-mono text-stone-100">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-stone-800 pt-3">
              <span className="text-amber-100 font-semibold">Total</span>
              <span className="font-mono text-amber-200 font-semibold text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-amber-100 text-stone-950 py-3.5 rounded text-xs uppercase tracking-widest font-semibold hover:bg-amber-200 transition shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
