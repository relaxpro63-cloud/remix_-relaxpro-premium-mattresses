export default {
  type: 'image',
  title: 'Image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alt Text', type: 'string', options: { isHighlighted: true } },
    { name: 'caption', title: 'Caption', type: 'string', options: { isHighlighted: true } },
  ],
}