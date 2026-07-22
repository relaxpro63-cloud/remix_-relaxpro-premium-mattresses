export default {
  name: 'pageSEO',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
    { name: 'ogImage', title: 'OG Image', type: 'imageWithAlt' },
    { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
    { name: 'noIndex', title: 'No Index', type: 'boolean' },
  ],
}
