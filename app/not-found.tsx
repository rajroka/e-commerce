import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-gray-200 select-none">404</p>
      <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mt-4 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 uppercase tracking-widest mb-10 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-gray-800 text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-black transition-all rounded"
      >
        Back to Home
      </Link>
    </main>
  );
}
