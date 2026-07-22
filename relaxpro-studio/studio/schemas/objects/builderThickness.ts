export default {
  name: 'builderThickness',
  title: 'Thickness option',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', description: 'e.g. 2 inches' },
    { name: 'valueInches', title: 'Thickness (inches)', type: 'number' },
    { name: 'addPrice', title: 'Add price (₹)', type: 'number', initialValue: 0 },
    { name: 'note', title: 'Short note', type: 'string' },
  ],
}
