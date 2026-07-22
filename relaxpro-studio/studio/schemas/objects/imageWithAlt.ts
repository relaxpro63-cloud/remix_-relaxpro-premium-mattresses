export default {
  name: 'imageWithAlt',
  title: 'Image with Alt Text',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alt Text', type: 'string', options: { isHighlighted: true } },
    { name: 'caption', title: 'Caption', type: 'string', options: { isHighlighted: true } },
  ],
}
