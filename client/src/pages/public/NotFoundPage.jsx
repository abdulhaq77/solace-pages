import React from "react";

export default function NotFoundPage() {
  return (
    <>
      <div className="text-center py-32 space-y-3">
        <h2 className="text-2xl font-serif text-amber-100">
          404 - Page Not Found
        </h2>
        <p className="text-stone-400 text-xs">
          The chapter or page you are looking for does not exist.
        </p>
      </div>
    </>
  );
}
