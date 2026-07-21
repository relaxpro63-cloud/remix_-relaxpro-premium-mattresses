export default {
  name: 'builderFabric',
  title: 'Builder fabric / cover',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: R => R.required() },
    { name: 'role', title: 'Role', type: 'string',
      options: { list: [
        { title: 'Primary cover', value: 'primaryCover' },
        { title: 'Quilting upgrade (add‑on)', value: 'quiltingUpgrade' },
      ]}, validation: R => R.required() },
    { name: 'gsm', title: 'GSM', type: 'string', description: 'e.g. 450 GSM' },
    { name: 'quiltingMm', title: 'Quilting (mm)', type: 'string', description: 'e.g. 12mm' },
    { name: 'benefit', title: 'One‑line benefit', type: 'string' },
    { name: 'addPrice', title: 'Add price (₹)', type: 'number', initialValue: 0 },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'isRecommended', title: 'Recommended default', type: 'boolean' },
    { name: 'order', title: 'Display order', type: 'number' },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true },
  ],
}
