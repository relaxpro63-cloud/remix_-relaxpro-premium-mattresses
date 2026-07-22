export default {
  name: 'sizeOption',
  title: 'Size Option',
  type: 'object',
  fields: [
    { name: 'name', title: 'Size Name', type: 'string', description: 'e.g., King, Queen, Single' },
    { name: 'dimensions', title: 'Dimensions', type: 'string', description: 'e.g., 78x72 inches' },
    { name: 'price', title: 'Price (INR)', type: 'number' },
    { name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true },
  ],
}
