import { sanityClient } from './sanity'

export async function getHomePage() {
  return sanityClient.fetch(`*[_type == "home"][0]{
    heroSection, featuresGrid, ownershipWays,
    shopByBrands{ sectionTitle, categories[]->{ name, slug, description, icon } },
    bestsellersSection{
      sectionTitle, products[]->{ name, slug, tagline, pricing, rating, "imageUrl": images[0].asset->url }, viewAllCta
    },
    costComparison, showroomCtaBanner, whyChooseUs,
    testimonialsSection{
      sectionTitle, overallRating, totalReviews,
      testimonials[]->{ customerName, location, rating, quote, isVerified }
    },
    allShowroomsSection{
      sectionTitle, showrooms[]->{ name, type, address, hours, contact, image }
    },
    faqSection{ sectionTitle, categories, faqs[]->{ question, category, answer } },
    bookingForm, diagnosticForm, seo
  }`)
}

export async function getAllProducts() {
  return sanityClient.fetch(`*[_type == "product" && inStock == true] | order(isBestseller desc, rating desc){
    name, slug, tagline, shortDescription, pricing, sizes, rating, reviewCount,
    isBestseller, isNew, tier, category->{ name, slug },
    "imageUrl": images[0].asset->url
  }`)
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      ..., category->{ name, slug },
      relatedProducts[]->{ name, slug, tagline, pricing, rating, "imageUrl": images[0].asset->url }
    }`,
    { slug }
  )
}

export async function getAllShowrooms() {
  return sanityClient.fetch(`*[_type == "showroom" && isActive == true] | order(order asc){
    name, slug, type, address, coordinates, hours, contact, ctaButtons, image
  }`)
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    branding, navigation, footer, contactInfo, announcement, seo, analytics
  }`)
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "about"][0]{ ... }`)
}

export async function getContactPage() {
  return sanityClient.fetch(`*[_type == "contact"][0]{ ..., showrooms[]->{ name, type, address, hours, contact, image } }`)
}

export async function getFaqsByCategory(category: string) {
  return sanityClient.fetch(
    `*[_type == "faq" && category == $category && published == true] | order(order asc){
      question, slug, category, answer
    }`,
    { category }
  )
}
