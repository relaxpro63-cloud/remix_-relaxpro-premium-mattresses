import { sanityClient } from './sanity'

export async function getBuilderData() {
  return sanityClient.fetch(`*[_type == "customBuilder"][0]{
    header, sizes, customSize, steps, summaryPanel, ctas, defaults, seo,
    "materials": *[_type=="builderMaterial" && isActive==true] | order(order asc){
      name, "slug": slug.current, slot, brand, density, ild, feelTag, benefit, tooltip,
      thicknessOptions, stackColor, isRecommended, image
    },
    "fabrics": *[_type=="builderFabric" && isActive==true] | order(order asc){
      name, "slug": slug.current, role, gsm, quiltingMm, benefit, addPrice, isRecommended, image
    }
  }`)
}

export async function getHomePage() {
  return sanityClient.fetch(`*[_type == "home"][0]{
    heroSection,
    featuresGrid,
    ownershipWays,
    shopByBrands {
      sectionTitle, sectionSubtitle,
      categories[]->{ name, slug, description, icon }
    },
    bestsellersSection {
      sectionTitle, sectionSubtitle,
      products[]->{ name, "slug": slug.current, tagline, pricing, rating, tier, comfortLevel, keyBenefit, images, isBestseller, isNew },
      viewAllCta
    },
    costComparison,
    showroomCtaBanner,
    whyChooseUs {
      sectionTitle, sectionSubtitle,
      benefits[] { icon, title, description }
    },
    testimonialsSection {
      sectionTitle, overallRating, totalReviews,
      testimonials[]->{ customerName, location, rating, quote, isVerified }
    },
    allShowroomsSection {
      sectionTitle, sectionDescription,
      showrooms[]->{ name, type, address, hours, contact, image }
    },
    faqSection {
      sectionTitle, sectionDescription, categories,
      faqs[]->{ question, category, answer }
    },
    comparisonSection, bookingForm, diagnosticForm, seo
  }`)
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    branding, navigation, footer, contactInfo, announcement
  }`)
}

export async function getAllProducts() {
  return sanityClient.fetch(`*[_type == "product" && inStock == true] | order(name asc){
    name, "slug": slug.current, tagline, subtitle, warranty, tier, comfortLevel, thickness,
    layers, fabricSpecs, certifications, accessories, keyBenefit, badges,
    pricingModel, pricing, images, features, metaTitle, metaDescription,
    rating, reviewCount, isBestseller, isNew, category->{ name, "slug": slug.current }
  }`)
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      ..., category->{ name, "slug": slug.current },
      relatedProducts[]->{ name, "slug": slug.current, tagline, pricing, rating, images }
    }`,
    { slug }
  )
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "about"][0]{
    hero, ourStory, ourProcess, certifications, values, teamSection, seo
  }`)
}

export async function getProductsPage() {
  return sanityClient.fetch(`*[_type == "productsPage"][0]{
    header, filterOptions, promoBanner, seo
  }`)
}

export async function getBrandCategories() {
  return sanityClient.fetch(`*[_type == "brandCategory"] | order(name asc){
    name, "slug": slug.current, description, icon
  }`)
}

export async function getFaqs() {
  return sanityClient.fetch(`*[_type == "faq" && published == true] | order(order asc){
    question, category, answer
  }`)
}

export async function getTestimonials() {
  return sanityClient.fetch(`*[_type == "testimonial" && featured == true] | order(order asc){
    customerName, location, rating, quote, isVerified
  }`)
}

export async function getAllShowrooms() {
  return sanityClient.fetch(`*[_type == "showroom" && isActive == true] | order(order asc){
    name, type, address, hours, contact, image
  }`)
}
