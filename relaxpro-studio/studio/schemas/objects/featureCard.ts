export default {
  name: 'featureCard',
  title: 'Feature Card',
  type: 'object',
  fields: [
    { name: 'icon', title: 'Icon (emoji or SVG name)', type: 'string' },
    { name: 'iconImage', title: 'Icon Image', type: 'imageWithAlt' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
  ],
}
