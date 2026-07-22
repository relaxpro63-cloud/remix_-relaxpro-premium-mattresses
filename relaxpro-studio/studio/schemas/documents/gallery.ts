export default {
  name: 'gallery',
  title: 'Image Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Gallery Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    {
      name: 'images', title: 'Images', type: 'array', of: [{
        type: 'imageWithAlt',
      }],
    },
  ],
}
