export default {
  name: 'brandCategory',
  title: 'Product Category',
  type: 'document',
  fields: [
    { name: 'name', title: 'Category Name', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'icon', title: 'Icon', type: 'imageWithAlt' },
    { name: 'bannerImage', title: 'Banner Image', type: 'imageWithAlt' },
    { name: 'order', title: 'Display Order', type: 'number' },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true },
  ],
  preview: { select: { title: 'name', media: 'icon' } },
}
