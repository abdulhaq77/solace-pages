import React from "react";

export default function ErrorPage() {
  return (
    <>
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-serif text-amber-100">
            Oops, something went wrong.
          </h1>
          <p className="text-stone-400 text-xs">
            The page you requested encountered an unexpected error.
          </p>
          <a
            href="/"
            className="inline-block text-xs uppercase tracking-widest text-amber-200 underline mt-2"
          >
            Return Home
          </a>
        </div>
      </div>
    </>
  );
}
