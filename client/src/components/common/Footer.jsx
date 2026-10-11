import React from "react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-900 py-12 text-stone-500 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p>
          © {new Date().getFullYear()} Solace Page. A digital e-novel
          marketplace. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <span className="hover:text-stone-300 cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-stone-300 cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-stone-300 cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}
