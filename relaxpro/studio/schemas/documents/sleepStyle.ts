export default {
  name: 'sleepStyle',
  title: 'Sleep Style',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', title: 'Description', type: 'text', rows: 2 },
    { name: 'linkText', title: 'Link Text', type: 'string' },
    { name: 'image', title: 'Image', type: 'imageWithAlt' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}
