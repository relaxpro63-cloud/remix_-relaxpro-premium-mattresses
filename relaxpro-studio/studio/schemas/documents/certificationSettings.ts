export default {
  name: 'certificationSettings',
  title: 'Certification Settings',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Trusted by International Quality Standards',
    },
    {
      name: 'sectionBadge',
      title: 'Section Badge Text',
      type: 'string',
      initialValue: 'Certified Quality',
    },
    {
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'buttonText',
      title: 'View Certificates Button Text',
      type: 'string',
      initialValue: 'View Certificates',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Warm White', value: '#FAF8F5' },
          { title: 'White', value: '#FFFFFF' },
          { title: 'Light Gray', value: '#F5F5F0' },
        ],
      },
      initialValue: '#FAF8F5',
    },
    {
      name: 'isEnabled',
      title: 'Enable Certification Section',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'certifications',
      title: 'Certifications',
      description: 'Select certifications to display on the homepage',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'certification' }] }],
    },
  ],
  preview: {
    select: { title: 'sectionTitle' },
    prepare({ title }: any) {
      return { title: title || 'Certification Settings' }
    },
  },
}
