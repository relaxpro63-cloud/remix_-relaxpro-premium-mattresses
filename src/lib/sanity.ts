import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const PROJECT_ID = 'de6mndac'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: !import.meta.env.DEV,
  ...(import.meta.env.DEV && {
    // In dev mode, route through Vite proxy (localhost:5173) to bypass CORS
    // The proxy in vite.config.ts rewrites /api/sanity → apicdn.sanity.io
    useProjectHostname: false,
    apiHost: window.location.origin + '/api/sanity',
  }),
})

const builder = createImageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}
