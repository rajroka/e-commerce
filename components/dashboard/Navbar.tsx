"use client";

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-lg font-semibold text-gray-800">
        Admin Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 hidden md:block">
          Welcome, Admin
        </p>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Logout
        </button>
      </div>
    </header>
  );
}
