import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCatalog, findProduct } from './_lib/catalog';
import { parseFilters, scoreProducts } from './_lib/recommend';
import { toRecommendedProduct } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const catalog = await getCatalog();
    const prefs = parseFilters(req.query as Record<string, string | string[] | undefined>);
    const scored = scoreProducts(catalog, prefs);

    const products = scored
      .map((s) => {
        const product = findProduct(catalog, s.slug);
        return product ? toRecommendedProduct(product, s) : null;
      })
      .filter((p) => p !== null);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ products, count: products.length });
  } catch (err) {
    console.error('[api/products]', err);
    return res.status(503).json({ error: 'Catalog unavailable', products: [], count: 0 });
  }
}
