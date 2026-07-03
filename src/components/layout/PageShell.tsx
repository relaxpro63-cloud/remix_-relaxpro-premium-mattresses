import React from 'react';
import { motion } from 'motion/react';
import SEO from '../seo/SEO';

export interface PageShellProps {
  title: string;
  description: string;
  ogImage?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  ogImage,
  schema,
  children,
}: PageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SEO title={title} description={description} ogImage={ogImage} schema={schema} />
      {children}
    </motion.div>
  );
}
