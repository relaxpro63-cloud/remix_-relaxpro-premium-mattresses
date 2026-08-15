import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
