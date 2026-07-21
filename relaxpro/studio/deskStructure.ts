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
              S.document().schemaType('home').documentId('home').title('Homepage'),
              S.document().schemaType('productsPage').documentId('productsPage').title('Products Page'),
              S.document().schemaType('customBuilder').documentId('customBuilder').title('Custom Builder'),
              S.document().schemaType('about').documentId('about').title('About Page'),
              S.document().schemaType('contact').documentId('contact').title('Contact Page'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('brandCategory').title('Categories'),
      S.documentTypeListItem('showroom').title('Showrooms'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.divider(),
      S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
    ])
