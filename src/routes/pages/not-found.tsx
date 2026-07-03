import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-20 text-center space-y-4"
    >
      <h2 className="text-2xl font-display text-brand-950">Mattress Not Found</h2>
      <p className="text-xs text-stone-500">We couldn't find a mattress matching that name. Let's find your perfect model in the catalog.</p>
      <Link to="/catalog" className="inline-block bg-brand-950 hover:bg-brand-800 text-white rounded-xl py-3 px-6 text-xs uppercase tracking-wider font-semibold font-display cursor-pointer">
        View All Models
      </Link>
    </motion.div>
  );
}
