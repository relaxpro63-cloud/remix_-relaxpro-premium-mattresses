export default {
  name: 'faq',
  title: 'FAQ / Sleep Guide',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'question' } },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Durability and Cores', 'Care and Setting Up', 'Custom Sizing', 'Shipping and Delivery', 'Warranty and Returns', 'General'] } },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] },
    { name: 'relatedProducts', title: 'Related Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'order', title: 'Display Order', type: 'number' },
    { name: 'published', title: 'Published', type: 'boolean', initialValue: true },
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
}
