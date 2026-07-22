export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', initialValue: 'Homepage Hero' },
    {
      name: 'slides', title: 'Slides', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'image', title: 'Background Image', type: 'imageWithAlt' },
          { name: 'badge', title: 'Badge Text', type: 'string' },
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'highlight', title: 'Highlight Word(s)', type: 'string', description: 'Gold-colored emphasis text in heading' },
          { name: 'subheading', title: 'Subheading', type: 'text', rows: 3 },
          {
            name: 'primaryCta', title: 'Primary CTA', type: 'ctaButton',
          },
          {
            name: 'secondaryCta', title: 'Secondary CTA', type: 'ctaButton',
          },
          {
            name: 'trustBadges', title: 'Trust Badges', type: 'array', of: [{
              type: 'object',
              fields: [
                { name: 'text', title: 'Badge Text', type: 'string' },
                { name: 'icon', title: 'Icon Name (lucide)', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },
  ],
}
