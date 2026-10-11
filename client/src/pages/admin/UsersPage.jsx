import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all registered users from backend
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await API.get("/admin/users")).data.data.users,
  });

  // Filter users by name or email
  const filteredUsers = usersData?.filter((user) => {
    const nameMatch = user.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = user.email
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Context Header */}
      <div className="border-b border-stone-800 pb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-200">
          User Directory
        </span>
        <h1 className="text-3xl font-serif text-amber-100 mt-1">
          Manage Users
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          View registered customer accounts, monitor roles, and track platform
          memberships.
        </p>
      </div>

      {/* Search & Header Bar */}
      <div className="sticky top-16 z-20 bg-stone-950/95 backdrop-blur-md pt-2 pb-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-300">
          Registered Accounts ({filteredUsers?.length || 0})
        </h3>

        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded px-4 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-xl overflow-hidden">
        {usersLoading ? (
          <div className="p-12 text-center text-stone-500 text-xs font-mono">
            Loading user registry...
          </div>
        ) : filteredUsers?.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs">
            No registered users found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/60 text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-stone-900/80 transition"
                  >
                    <td className="p-4 font-medium text-stone-200">
                      {user.name || "Unnamed User"}
                    </td>
                    <td className="p-4 text-stone-400 font-mono">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                          user.role === "admin"
                            ? "bg-amber-400/10 border border-amber-400/30 text-amber-200"
                            : "bg-stone-800 text-stone-300 border border-stone-700"
                        }`}
                      >
                        {user.role || "customer"}
                      </span>
                    </td>
                    <td className="p-4 text-stone-500 font-mono text-[11px]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-sans text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
