"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">🚀 Next.js + Tailwind Starter</h1>
      <p className="mb-4 text-lg">This is your home page running on Next.js 13+.</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
        >
          Increment
        </button>
        <span className="text-2xl font-semibold">{count}</span>
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
        >
          Decrement
        </button>
      </div>
    </main>
  );
}
