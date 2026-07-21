import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/images/products/prakriti.webp',
  schema
}: SEOProps) {
  const siteUrl = 'https://remix-relaxpro-matress.vercel.app';
  const location = useLocation();
  const computedPath = canonical ?? `${location.pathname}${location.search}`;
  const fullCanonical = computedPath.startsWith('http')
    ? computedPath
    : `${siteUrl}${computedPath.startsWith('/') ? computedPath : `/${computedPath}`}`;

  return (
    <Helmet>
      {/* Title & Meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="RelaxPro Premium Mattresses" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />

      {/* Structured Data / JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
