export default {
  name: 'accessory',
  title: 'Accessory',
  type: 'document',
  fields: [
    { name: 'name', title: 'Product Name', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (R: any) => R.required() },
    { name: 'tagline', title: 'Tagline / Short Description', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 4 },
    {
      name: 'type', title: 'Accessory Type',
      type: 'string',
      options: {
        list: [
          { title: 'Latex Pillow', value: 'latex_pillow' },
          { title: 'Shredded Latex Pillow', value: 'shredded_pillow' },
          { title: 'Fiber Pillow', value: 'fiber_pillow' },
          { title: 'Mattress Protector', value: 'mattress_protector' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (R: any) => R.required(),
    },
    {
      name: 'pricing', title: 'Pricing', type: 'object',
      fields: [
        { name: 'price', title: 'Price (INR)', type: 'number', initialValue: 0 },
        { name: 'mrp', title: 'MRP (INR)', type: 'number', initialValue: 0 },
        { name: 'currency', title: 'Currency', type: 'string', initialValue: '₹' },
      ],
    },
    { name: 'sizes', title: 'Available Sizes', type: 'array', of: [{ type: 'string' }], options: { list: ['Standard', 'King', 'Queen', 'Single'] } },
    { name: 'features', title: 'Key Features', type: 'array', of: [{ type: 'string' }] },
    { name: 'images', title: 'Product Images', type: 'array', of: [{ type: 'imageWithAlt' }] },
    { name: 'thumbnail', title: 'Thumbnail', type: 'imageWithAlt' },
    { name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true },
    { name: 'isNew', title: 'New Arrival', type: 'boolean' },
    { name: 'isBestseller', title: 'Bestseller', type: 'boolean' },
    { name: 'sortOrder', title: 'Sort Order', type: 'number' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'type', media: 'thumbnail' },
  },
  orderings: [
    { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] },
  ],
}
