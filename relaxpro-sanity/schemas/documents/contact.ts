export default {
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    { name: 'hero', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }] },
    { name: 'contactCards', title: 'Contact Info Cards', type: 'array', of: [{ type: 'object', fields: [{ name: 'icon', title: 'Icon', type: 'string' }, { name: 'label', title: 'Label', type: 'string' }, { name: 'value', title: 'Value', type: 'string' }, { name: 'link', title: 'Link', type: 'string' }] }] },
    { name: 'showrooms', title: 'Showroom Locations', type: 'array', of: [{ type: 'reference', to: [{ type: 'showroom' }] }] },
    { name: 'bookingForm', title: 'Booking Form', type: 'formConfig' },
    { name: 'mapEmbed', title: 'Map Embed', type: 'object', fields: [{ name: 'embedUrl', title: 'Google Maps Embed URL', type: 'url' }, { name: 'title', title: 'Map Title', type: 'string' }] },
    { name: 'helpSection', title: 'Help / Support Section', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'content', title: 'Content', type: 'text', rows: 4 }, { name: 'supportHours', title: 'Support Hours', type: 'string' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
