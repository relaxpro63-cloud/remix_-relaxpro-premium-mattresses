import { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('RelaxPro CMS')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.documentListItem().schemaType('home').documentId('home').title('Homepage'),
              S.documentListItem().schemaType('productsPage').documentId('productsPage').title('Products Page'),
              S.documentListItem().schemaType('customBuilder').documentId('customBuilder').title('Custom Builder'),
              S.documentListItem().schemaType('about').documentId('about').title('About Page'),
              S.documentListItem().schemaType('contact').documentId('contact').title('Contact Page'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('brandCategory').title('Categories'),
      S.documentTypeListItem('showroom').title('Showrooms'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.divider(),
      S.documentListItem().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
    ])
