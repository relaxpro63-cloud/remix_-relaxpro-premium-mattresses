export default {
  name: 'formConfig',
  title: 'Form Configuration',
  type: 'object',
  fields: [
    { name: 'title', title: 'Form Title', type: 'string' },
    { name: 'subtitle', title: 'Form Subtitle', type: 'text', rows: 2 },
    { name: 'submitButtonText', title: 'Submit Button Text', type: 'string' },
    { name: 'successMessage', title: 'Success Message', type: 'string' },
    {
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Field Name', type: 'string' },
            { name: 'label', title: 'Field Label', type: 'string' },
            { name: 'type', title: 'Field Type', type: 'string', options: { list: ['text', 'tel', 'email', 'select', 'date', 'textarea', 'time'] } },
            { name: 'required', title: 'Required', type: 'boolean' },
            { name: 'options', title: 'Dropdown Options', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    },
  ],
}
