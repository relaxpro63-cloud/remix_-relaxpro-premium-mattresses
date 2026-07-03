import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-paper">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-500 mb-4">Error 404</p>
        <h1 className="text-5xl md:text-6xl font-serif font-semibold text-brand-900 mb-4">
          Page not found
        </h1>
        <p className="text-lg text-brand-700 mb-8">
          The page you're looking for may have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-900 px-6 py-3 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-full border border-brand-900 px-6 py-3 text-sm font-medium text-brand-900 hover:bg-brand-900 hover:text-white transition-colors"
          >
            Browse Mattresses
          </Link>
        </div>
      </div>
    </div>
  );
}
