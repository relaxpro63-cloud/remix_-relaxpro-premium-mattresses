export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'customerName', title: 'Customer Name', type: 'string', validation: (R: any) => R.required() },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (R: any) => R.min(1).max(5) },
    { name: 'quote', title: 'Review Text', type: 'text', rows: 5 },
    { name: 'isVerified', title: 'Verified Purchase', type: 'boolean' },
    { name: 'avatar', title: 'Customer Photo', type: 'imageWithAlt' },
    { name: 'productPurchased', title: 'Product Purchased', type: 'reference', to: [{ type: 'product' }] },
    { name: 'date', title: 'Review Date', type: 'date' },
    { name: 'featured', title: 'Featured on Homepage', type: 'boolean' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
  preview: { select: { title: 'customerName', subtitle: 'location' } },
}
