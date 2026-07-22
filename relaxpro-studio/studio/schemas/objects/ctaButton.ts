export default {
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    { name: 'label', title: 'Button Text', type: 'string' },
    { name: 'link', title: 'Link URL', type: 'string' },
    {
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Green)', value: 'primary' },
          { title: 'Secondary (Outline)', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
        ],
      },
      initialValue: 'primary',
    },
    { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' },
  ],
}
