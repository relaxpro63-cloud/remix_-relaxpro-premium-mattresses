export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', initialValue: 'Main Navigation' },
    {
      name: 'desktopMenu', title: 'Desktop Menu', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'path', title: 'Path', type: 'string' },
          { name: 'icon', title: 'Icon Name', type: 'string' },
          { name: 'isCta', title: 'Is CTA Button?', type: 'boolean' },
          {
            name: 'children', title: 'Dropdown Items', type: 'array', of: [{
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'path', title: 'Path', type: 'string' },
                { name: 'description', title: 'Description', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },
    {
      name: 'mobileMenu', title: 'Mobile Menu', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'path', title: 'Path', type: 'string' },
        ],
      }],
    },
    {
      name: 'footerMenu', title: 'Footer Menu', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'heading', title: 'Column Heading', type: 'string' },
          {
            name: 'links', title: 'Links', type: 'array', of: [{
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'path', title: 'Path', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },
  ],
}
