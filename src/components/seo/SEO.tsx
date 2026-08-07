import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSiteSettings } from '../../lib/queries';
import { SITE_URL, toAbsoluteUrl } from '../../lib/site';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  schema,
  noindex = false
}: SEOProps) {
  const [siteName, setSiteName] = useState('RelaxPro Premium Mattresses');
  const [siteUrl, setSiteUrl] = useState(SITE_URL);
  const [defaultOgImage, setDefaultOgImage] = useState(ogImage || '');
  const location = useLocation();

  useEffect(() => {
    getSiteSettings().then(s => {
      if (s?.branding?.siteName) setSiteName(s.branding.siteName);
      if (s?.seo?.ogImage) {
        // Reuse the imageUrl helper for proper Sanity CDN URLs
        import('../../lib/queries').then(({ imageUrl }) => {
          const url = imageUrl(s.seo.ogImage);
          if (url) setDefaultOgImage(url);
        });
      }
      if (s?.seo?.metaTitle) setSiteName(s.branding?.siteName || siteName);
    }).catch(() => {});
  }, []);

  const computedPath = canonical ?? `${location.pathname}${location.search}`;
  const fullCanonical = computedPath.startsWith('http')
    ? computedPath
    : `${siteUrl}${computedPath.startsWith('/') ? computedPath : `/${computedPath}`}`;

  const resolvedOgImage = toAbsoluteUrl(ogImage || defaultOgImage || '/favicon-128x128.png');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

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
