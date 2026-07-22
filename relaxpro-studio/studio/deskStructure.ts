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
              S.documentListItem({ schemaType: 'home', id: 'home', title: 'Homepage' }),
              S.documentListItem({ schemaType: 'productsPage', id: 'productsPage', title: 'Products Page' }),
              S.documentListItem({ schemaType: 'customBuilder', id: 'customBuilder', title: 'Mattress Builder' }),
              S.documentListItem({ schemaType: 'about', id: 'about', title: 'About Page' }),
              S.documentListItem({ schemaType: 'contact', id: 'contact', title: 'Contact Page' }),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('brandCategory').title('Categories'),
      S.documentTypeListItem('showroom').title('Showrooms'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.divider(),
      S.listItem()
        .title('Builder')
        .child(
          S.list()
            .title('Builder')
            .items([
              S.documentTypeListItem('builderMaterial').title('Materials'),
              S.documentTypeListItem('builderFabric').title('Fabrics'),
            ])
        ),
      S.divider(),
      S.documentListItem({ schemaType: 'siteSettings', id: 'siteSettings', title: 'Site Settings' }),
    ])
