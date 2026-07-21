export default {
  name: 'customBuilder',
  title: 'Custom Builder Page',
  type: 'document',
  fields: [
    { name: 'header', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 3 }] },
    {
      name: 'steps', title: 'Builder Steps', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'stepNumber', title: 'Step Number', type: 'number' },
          { name: 'title', title: 'Step Title', type: 'string' },
          { name: 'description', title: 'Step Description', type: 'text', rows: 2 },
          { name: 'options', title: 'Options', type: 'array', of: [{ type: 'object', fields: [{ name: 'label', title: 'Option Label', type: 'string' }, { name: 'description', title: 'Option Description', type: 'string' }, { name: 'priceModifier', title: 'Price Modifier (INR)', type: 'number' }, { name: 'image', title: 'Option Image', type: 'imageWithAlt' }] }] },
        ],
      }],
    },
    { name: 'basePrice', title: 'Base Price (INR)', type: 'number' },
    { name: 'ctaSection', title: 'CTA Section', type: 'object', fields: [{ name: 'buttonText', title: 'Button Text', type: 'string' }, { name: 'note', title: 'Note Text', type: 'string' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
