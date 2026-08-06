import React, { useEffect } from 'react';

const STUDIO_URL = import.meta.env.DEV
  ? 'http://localhost:3333'
  : 'https://relaxpro.sanity.studio';

export default function StudioRedirect() {
  useEffect(() => {
    window.location.replace(STUDIO_URL);
  }, []);

  return (
    <div className="rp-container py-24 text-center">
      <p className="text-sm font-accent text-graphite-500">Redirecting to Sanity Studio…</p>
    </div>
  );
}
