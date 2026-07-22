export default {
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  fields: [
    { name: 'header', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }] },
    { name: 'filterOptions', title: 'Filter Options', type: 'object', fields: [{ name: 'categories', title: 'Category Filters', type: 'array', of: [{ type: 'reference', to: [{ type: 'brandCategory' }] }] }, { name: 'sortOptions', title: 'Sort Options', type: 'array', of: [{ type: 'string' }] }] },
    { name: 'promoBanner', title: 'Promo Banner (optional)', type: 'object', fields: [{ name: 'show', title: 'Show Banner', type: 'boolean' }, { name: 'text', title: 'Banner Text', type: 'string' }, { name: 'image', title: 'Banner Image', type: 'imageWithAlt' }, { name: 'cta', title: 'CTA', type: 'ctaButton' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
