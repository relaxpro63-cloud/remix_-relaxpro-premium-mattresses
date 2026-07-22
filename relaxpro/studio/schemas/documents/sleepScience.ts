export default {
  name: 'sleepScience',
  title: 'Sleep Science Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'string', initialValue: 'Sleep Science' },
    { name: 'badge', title: 'Badge Text', type: 'string', initialValue: 'PHYSIOLOGICAL WELLNESS DATABASE' },
    { name: 'heading', title: 'Heading', type: 'string', initialValue: 'The Science of Sleep Orthopedics' },
    { name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 3 },
    {
      name: 'tabs', title: 'Content Tabs', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'content', title: 'Tab Content', type: 'richText' },
        ],
      }],
    },
    {
      name: 'comparisonSection', title: 'Latex vs Foam Comparison', type: 'object',
      fields: [
        { name: 'badge', title: 'Badge Text', type: 'string' },
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
        {
          name: 'columns', title: 'Column Headers', type: 'object',
          fields: [
            { name: 'criteria', title: 'Criteria Label', type: 'string', initialValue: 'CRITERIA' },
            { name: 'latex', title: 'Latex Label', type: 'string', initialValue: 'DUNLOP LATEX' },
            { name: 'foam', title: 'Foam Label', type: 'string', initialValue: 'MEMORY FOAM' },
          ],
        },
        {
          name: 'rows', title: 'Comparison Rows', type: 'array', of: [{
            type: 'object',
            fields: [
              { name: 'criteria', title: 'Criteria', type: 'string' },
              { name: 'latex', title: 'Latex Value', type: 'string' },
              { name: 'foam', title: 'Foam Value', type: 'string' },
            ],
          }],
        },
      ],
    },
    {
      name: 'orthopedicSection', title: 'Orthopedic Section', type: 'object',
      fields: [
        { name: 'badge', title: 'Badge Text', type: 'string' },
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'content', title: 'Content', type: 'richText' },
      ],
    },
    {
      name: 'certifications', title: 'Certification Cards', type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 4 },
          { name: 'image', title: 'Image', type: 'imageWithAlt' },
        ],
      }],
    },
    { name: 'ctaBadge', title: 'CTA Badge Text', type: 'string' },
    { name: 'ctaHeading', title: 'CTA Heading', type: 'string' },
    { name: 'ctaDescription', title: 'CTA Description', type: 'text', rows: 2 },
    { name: 'ctaLabel', title: 'CTA Button Label', type: 'string' },
    { name: 'ctaLink', title: 'CTA Button Link', type: 'string' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
