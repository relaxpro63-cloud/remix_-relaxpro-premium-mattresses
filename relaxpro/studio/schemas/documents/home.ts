export default {
  name: 'home',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Main Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 4 },
        { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' },
        { name: 'ctaButtons', title: 'CTA Buttons', type: 'array', of: [{ type: 'ctaButton' }], validation: (Rule: any) => Rule.max(3) },
      ],
    },
    { name: 'featuresGrid', title: 'Features / Trust Badges', type: 'array', of: [{ type: 'featureCard' }], validation: (Rule: any) => Rule.min(2).max(6) },
    {
      name: 'ownershipWays',
      title: 'Two Ways to Own a RelaxPro',
      type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        {
          name: 'customBuilder', title: 'Build Your Own Card', type: 'object',
          fields: [
            { name: 'title', title: 'Card Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'features', title: 'Feature List', type: 'array', of: [{ type: 'string' }] },
            { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
            { name: 'image', title: 'Card Image', type: 'imageWithAlt' },
          ],
        },
        {
          name: 'shopPrebuilt', title: 'Shop Pre-Built Card', type: 'object',
          fields: [
            { name: 'title', title: 'Card Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'features', title: 'Feature List', type: 'array', of: [{ type: 'string' }] },
            { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
            { name: 'image', title: 'Card Image', type: 'imageWithAlt' },
          ],
        },
      ],
    },
    {
      name: 'shopByBrands', title: 'Shop by Brands / Categories', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'brandCategory' }] }] },
      ],
    },
    {
      name: 'bestsellersSection', title: 'Bestselling Products Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'products', title: 'Featured Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }], validation: (Rule: any) => Rule.max(8) },
        { name: 'viewAllCta', title: 'View All CTA', type: 'ctaButton' },
      ],
    },
    {
      name: 'costComparison', title: 'Cost Comparison Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        {
          name: 'naturalLatex', title: 'Natural Latex Column', type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'avgPrice', title: 'Average Price', type: 'string' },
            { name: 'lifespan', title: 'Lifespan', type: 'string' },
            { name: 'perYearCost', title: 'Per Year Cost', type: 'string' },
            { name: 'perDayCost', title: 'Per Day Cost', type: 'string' },
            { name: 'highlighted', title: 'Highlighted (Recommended)', type: 'boolean' },
          ],
        },
        {
          name: 'ordinaryFoam', title: 'Ordinary Foam Column', type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'avgPrice', title: 'Average Price', type: 'string' },
            { name: 'lifespan', title: 'Lifespan', type: 'string' },
            { name: 'perYearCost', title: 'Per Year Cost', type: 'string' },
            { name: 'perDayCost', title: 'Per Day Cost', type: 'string' },
          ],
        },
        { name: 'footnote', title: 'Footnote / Disclaimer', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'showroomCtaBanner', title: 'Showroom CTA Banner', type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'locationName', title: 'Location Name', type: 'string' },
        { name: 'address', title: 'Address', type: 'text', rows: 3 },
        { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' },
        { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
      ],
    },
    {
      name: 'whyChooseUs', title: 'Why Choose RelaxPro', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'featureCard' }], validation: (Rule: any) => Rule.min(3).max(8) },
      ],
    },
    {
      name: 'testimonialsSection', title: 'Testimonials Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'overallRating', title: 'Overall Rating', type: 'string' },
        { name: 'totalReviews', title: 'Total Reviews Count', type: 'string' },
        { name: 'testimonials', title: 'Featured Testimonials', type: 'array', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }], validation: (Rule: any) => Rule.max(6) },
      ],
    },
    {
      name: 'allShowroomsSection', title: 'All Showrooms Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionDescription', title: 'Section Description', type: 'text', rows: 3 },
        { name: 'showrooms', title: 'Showrooms to Display', type: 'array', of: [{ type: 'reference', to: [{ type: 'showroom' }] }] },
      ],
    },
    {
      name: 'faqSection', title: 'FAQ / Sleep Guides Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionDescription', title: 'Section Description', type: 'text', rows: 3 },
        { name: 'categories', title: 'FAQ Category Tabs', type: 'array', of: [{ type: 'string' }] },
        { name: 'faqs', title: 'FAQ Items', type: 'array', of: [{ type: 'reference', to: [{ type: 'faq' }] }] },
      ],
    },
    {
      name: 'comparisonSection', title: 'Comparison Table (RelaxPro vs Others)', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        {
          name: 'items', title: 'Comparison Items', type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'relaxProTitle', title: 'RelaxPro Title', type: 'string' },
              { name: 'icon', title: 'Icon', type: 'string', options: { list: [{ title: 'Leaf', value: 'leaf' }, { title: 'Award', value: 'award' }, { title: 'Sliders', value: 'sliders' }, { title: 'Check Circle', value: 'check' }, { title: 'Heart Pulse', value: 'heart' }, { title: 'Shield Check', value: 'shield' }] } },
              { name: 'otherTitle', title: 'Other Brands Title', type: 'string' },
              { name: 'otherSubtext', title: 'Other Brands Subtext (optional)', type: 'string' },
            ],
          }],
        },
      ],
    },
    {
      name: 'sleepStyleGuide', title: 'Sleep Style Guide Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'styles', title: 'Sleep Styles', type: 'array', of: [{ type: 'reference', to: [{ type: 'sleepStyle' }] }] },
      ],
    },
    {
      name: 'engineeredPosture', title: 'Engineered Posture Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        {
          name: 'categories', title: 'Posture Categories', type: 'array', of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Title', type: 'string' },
              { name: 'subtitle', title: 'Subtitle', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 3 },
              { name: 'items', title: 'Product Names', type: 'array', of: [{ type: 'string' }] },
              { name: 'linkText', title: 'Link Button Text', type: 'string' },
              { name: 'slug', title: 'Link Slug', type: 'string' },
              { name: 'image', title: 'Background Image', type: 'imageWithAlt' },
            ],
          }],
        },
      ],
    },
    {
      name: 'quickConnect', title: 'Quick Connect Bar', type: 'object',
      fields: [
        {
          name: 'items', title: 'Quick Connect Items', type: 'array', of: [{
            type: 'object',
            fields: [
              { name: 'label', title: 'Label', type: 'string' },
              { name: 'icon', title: 'Icon Name (lucide)', type: 'string' },
              { name: 'link', title: 'Link URL', type: 'string' },
            ],
          }],
        },
      ],
    },
    {
      name: 'featuredComponents', title: 'Featured Brand Components', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string', initialValue: 'What Inside Counts: Premium Components' },
        {
          name: 'components', title: 'Brand Components', type: 'array', of: [{
            type: 'object',
            fields: [
              { name: 'title', title: 'Component Title', type: 'string' },
              { name: 'description', title: 'Description', type: 'text', rows: 4 },
              { name: 'badge', title: 'Certification Badge', type: 'string' },
              { name: 'image', title: 'Component Image', type: 'imageWithAlt' },
            ],
          }],
        },
      ],
    },
    { name: 'bookingForm', title: 'Book Showroom Visit Form', type: 'formConfig' },
    { name: 'diagnosticForm', title: 'Diagnostic Consultation Form', type: 'formConfig' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
