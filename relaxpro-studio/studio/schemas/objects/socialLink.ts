export default {
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: ['WhatsApp', 'Instagram', 'Facebook', 'YouTube', 'Twitter/X', 'LinkedIn'] },
    },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'icon', title: 'Icon Image', type: 'imageWithAlt' },
  ],
}
