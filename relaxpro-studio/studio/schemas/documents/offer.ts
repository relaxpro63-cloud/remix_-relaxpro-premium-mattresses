export default {
  name: 'offer',
  title: 'Offer / Campaign',
  type: 'document',
  fields: [
    { name: 'title', title: 'Offer Title', type: 'string', validation: (R: any) => R.required() },
    { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'bannerImage', title: 'Banner Image', type: 'imageWithAlt' },
    { name: 'badge', title: 'Badge Text (e.g. "Limited Time")', type: 'string' },
    {
      name: 'type', title: 'Offer Type',
      type: 'string',
      options: {
        list: [
          { title: 'Discount Offer', value: 'discount' },
          { title: 'Bundle Offer', value: 'bundle' },
          { title: 'Seasonal Banner', value: 'seasonal' },
          { title: 'Promo Banner', value: 'promo' },
        ],
      },
      initialValue: 'promo',
    },
    { name: 'discountText', title: 'Discount Text (e.g. "20% OFF")', type: 'string' },
    {
      name: 'cta', title: 'CTA Button', type: 'ctaButton',
    },
    { name: 'couponCode', title: 'Coupon Code', type: 'string', description: 'Optional coupon code customers can use' },
    {
      name: 'targetProducts', title: 'Target Products', type: 'array',
      description: 'Optional: link this offer to specific products',
      of: [{ type: 'reference', to: [{ type: 'product' }, { type: 'accessory' }] }],
    },
    { name: 'startDate', title: 'Start Date', type: 'datetime', options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' } },
    { name: 'endDate', title: 'End Date', type: 'datetime', options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' } },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true, description: 'Only active offers display on the website' },
    { name: 'showBanner', title: 'Show as Announcement Banner', type: 'boolean', description: 'When enabled, this offer appears as a top banner across all pages' },
    { name: 'bannerColor', title: 'Banner Color', type: 'string', options: { list: ['brand', 'amber', 'green', 'blue', 'red'] }, initialValue: 'brand' },
    { name: 'priority', title: 'Display Priority', type: 'number', description: 'Higher numbers show first' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'discountText',
      media: 'bannerImage',
    },
  },
  orderings: [
    { title: 'Priority', name: 'priority', by: [{ field: 'priority', direction: 'desc' }] },
    { title: 'Start Date', name: 'startDate', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
}
