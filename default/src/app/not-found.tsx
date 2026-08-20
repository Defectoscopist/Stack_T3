import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}