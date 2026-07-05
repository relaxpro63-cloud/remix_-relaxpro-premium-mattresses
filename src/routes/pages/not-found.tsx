import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rp-container py-24 text-center"
    >
      <div className="mx-auto max-w-md rounded-3xl border border-brand-200 bg-white p-8 shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-primary">Mattress not found</h1>
      <p className="mt-3 text-sm text-neutral-dark">We could not find that mattress. Start with the catalog or return home.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link to="/catalog" className="inline-flex justify-center bg-primary hover:bg-brand-800 text-white rounded-full py-3 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer">
        View All Models
      </Link>
      <Link to="/" className="inline-flex justify-center border border-brand-200 text-primary hover:border-accent hover:text-accent rounded-full py-3 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer">
        Return Home
      </Link>
      </div>
      </div>
    </motion.div>
  );
}
