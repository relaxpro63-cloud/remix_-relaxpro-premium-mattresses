export default {
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    { type: 'block', styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'H4', value: 'h4' },
      { title: 'Quote', value: 'blockquote' },
    ], marks: {
      decorators: [
        { title: 'Bold', value: 'strong' },
        { title: 'Italic', value: 'em' },
        { title: 'Code', value: 'code' },
      ],
      annotations: [
        { name: 'link', title: 'Link', type: 'object', fields: [
          { name: 'href', title: 'URL', type: 'url' },
          { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' },
        ]},
      ],
    }},
    { type: 'imageWithAlt' },
    { type: 'ctaButton' },
  ],
}
