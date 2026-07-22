export default {
  name: 'location',
  title: 'Showroom Location',
  type: 'document',
  fields: [
    { name: 'city', title: 'City', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'city', maxLength: 96 } },
    { name: 'address', title: 'Address', type: 'text', rows: 3 },
    { name: 'phones', title: 'Phone Numbers', type: 'array', of: [{ type: 'string' }] },
    { name: 'hours', title: 'Opening Hours', type: 'string' },
    { name: 'image', title: 'Location Image', type: 'imageWithAlt' },
    { name: 'mapLink', title: 'Google Maps Link', type: 'url' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}
