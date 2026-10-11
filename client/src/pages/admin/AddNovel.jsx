import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "../../services/api.js";
import AddNovelForm from "../../components/admin/AddNovelForm.jsx";

export default function AddNovel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation to create a new novel
  const createMutation = useMutation({
    mutationFn: async (formData) =>
      await API.post("/admin/novels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      // Invalidate queries so inventory & stats update instantly across the admin panel
      queryClient.invalidateQueries(["novels-catalog"]);
      queryClient.invalidateQueries(["admin-stats"]);
      alert("Novel published successfully!");
      navigate("/admin/inventory");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to create novel");
    },
  });

  const handleCreateSubmit = (formData, resetForm) => {
    createMutation.mutate(formData, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Page Title & Context Header */}
      <div className="border-b border-stone-800 pb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-200">
          Catalog Creation
        </span>
        <h1 className="text-3xl font-serif text-amber-100 mt-1">
          Add New E-Novel
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Upload novel metadata, configure digital pricing, attach cover art,
          and publish directly to the Solace Page marketplace.
        </p>
      </div>

      {/* Form Component Container */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-6 sm:p-8">
        <AddNovelForm
          onSubmitMutation={handleCreateSubmit}
          isPending={createMutation.isPending}
        />
      </div>
    </div>
  );
}
