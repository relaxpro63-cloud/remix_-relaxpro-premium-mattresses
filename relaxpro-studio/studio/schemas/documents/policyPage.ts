export default {
  name: 'policyPage',
  title: 'Policy Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'content', title: 'Page Content', type: 'richText' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
