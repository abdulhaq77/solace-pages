import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/api.js";
import { CiSearch } from "react-icons/ci";

export default function Navbar({ user, handleLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // For syncing if already on shop page

  const { data } = useQuery({
    queryKey: ["cart-count"],
    queryFn: async () => (await API.get("/cart")).data.data,
    retry: false,
  });

  const cartCount = data?.cart?.items?.length || 0;

  // Fetch novels for live autocomplete suggestions
  const { data: novelsData } = useQuery({
    queryKey: ["novels-catalog"],
    queryFn: async () => (await API.get("/novels")).data.data.novels,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // Filter matching suggestions based on typing
  const suggestions = searchQuery.trim()
    ? novelsData
        ?.filter(
          (novel) =>
            novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            novel.author.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5) || []
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const chosen = suggestions[selectedIndex];
        navigate(`/shop?search=${encodeURIComponent(chosen.title)}`);
        setSearchQuery("");
        setIsDropdownOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSuggestion = (title) => {
    navigate(`/shop?search=${encodeURIComponent(title)}`);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900/85 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-sm font-serif text-amber-100 tracking-wider sm:text-2xl shrink-0"
        >
          Solace Page
        </Link>

        {/* Responsive Search Bar with Live Suggestions & Keyboard Navigation */}
        <div
          ref={searchRef}
          className="relative flex-1 max-w-xs sm:max-w-sm mx-2"
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search novels, authors..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-stone-950 border border-stone-800 rounded-full px-3.5 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-200 text-xs"
            >
              <CiSearch />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-stone-950 border border-stone-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-stone-900">
              {suggestions.map((novel, index) => (
                <div
                  key={novel._id}
                  onClick={() => handleSelectSuggestion(novel.title)}
                  className={`px-4 py-2.5 flex items-center space-x-3 cursor-pointer transition ${
                    selectedIndex === index
                      ? "bg-amber-100/10 text-amber-200"
                      : "hover:bg-stone-900/80 text-stone-300"
                  }`}
                >
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="w-7 h-10 object-cover rounded border border-stone-800 shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1544947950-fa07a98d237f";
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-serif text-amber-100 truncate">
                      {novel.title}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {novel.author} •{" "}
                      <span className="font-mono text-amber-200">
                        ${novel.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-3 sm:space-x-6 text-xs uppercase tracking-widest text-stone-300 font-semibold shrink-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-amber-200 transition"
                : "hover:text-amber-200 transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "text-amber-200 transition"
                : "hover:text-amber-200 transition"
            }
          >
            Shop
          </NavLink>

          {/* Customer Specific Views */}
          {user && user.role === "customer" ? (
            <>
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-200 transition"
                    : "hover:text-amber-200 transition"
                }
              >
                My Library
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-200 transition relative"
                    : "hover:text-amber-200 transition relative"
                }
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-amber-400 text-stone-950 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-stone-400 hover:text-rose-300 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            /* Guest Specific Views */
            <div className="flex items-center space-x-3">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "bg-amber-300 text-stone-950 px-3.5 py-2 rounded text-[10px] tracking-widest uppercase font-bold transition"
                    : "bg-amber-100 text-stone-950 px-3.5 py-2 rounded text-[10px] tracking-widest uppercase font-bold hover:bg-amber-200 transition"
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
