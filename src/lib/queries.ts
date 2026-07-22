import { sanityClient } from './sanity'
import { urlFor } from './sanity'

export function imageUrl(source: any) {
  if (!source) return ''
  if (typeof source === 'string') return source
  if (typeof source === 'object') {
    const assetRef = source.asset?._ref || source.asset?._id || source._ref
    if (assetRef) {
      return urlFor({ ...source, asset: { ...(source.asset || {}), _ref: assetRef } }).url()
    }
  }
  return ''
}

export function imageUrlFor(source: any, width?: number) {
  if (!source) return ''
  if (typeof source === 'string') return source
  if (typeof source === 'object') {
    const assetRef = source.asset?._ref || source.asset?._id || source._ref
    if (assetRef) {
      const b = urlFor({ ...source, asset: { ...(source.asset || {}), _ref: assetRef } })
      return width ? b.width(width).url() : b.url()
    }
  }
  return ''
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    branding { siteName, tagline, logo, favicon },
    navigation { mainMenu, footerMenu, ctaButton, phoneNumber },
    footer { description, socialLinks, certifications[]{name, image}, copyrightText },
    contactInfo { mainPhone, secondaryPhone, whatsappNumber, whatsappDefaultMessage, email, factoryAddress },
    announcement { showBanner, bannerText, bannerLink, bannerColor },
    staticImages { gotsCotton, quiltedCotton, naturalLatex, comfortMeter, sizeChart, heroBedroom },
    seo { metaTitle, metaDescription, ogImage },
    analytics { gaTrackingId, metaPixelId, gtmId }
  }`)
}

export async function getNavigation() {
  return sanityClient.fetch(`*[_type == "navigation"][0]{
    desktopMenu[]{ label, path, icon, isCta, children[]{ label, path, description } },
    mobileMenu[]{ label, path },
    footerMenu[]{ heading, links[]{ label, path } }
  }`)
}

export async function getHero() {
  return sanityClient.fetch(`*[_type == "hero"][0]{
    slides[]{
      image{ asset->{ _id, url }, alt },
      badge, heading, highlight, subheading, description,
      primaryCta { label, link, variant, openInNewTab },
      secondaryCta { label, link, variant, openInNewTab },
      trustBadges[]{ text, icon }
    }
  }`)
}

export async function getHomePage() {
  return sanityClient.fetch(`*[_type == "home"][0]{
    featuresGrid[]{ title, description, icon },
    ownershipWays {
      sectionTitle, sectionSubtitle,
      customBuilder { title, description, features, cta { label, link, variant }, image { asset->{_id, url}, alt } },
      shopPrebuilt { title, description, features, cta { label, link, variant }, image { asset->{_id, url}, alt } }
    },
    shopByBrands { sectionTitle, sectionSubtitle,
      categories[]->{ name, "slug": slug.current, description, image { asset->{_id, url}, alt } }
    },
    bestsellersSection {
      sectionTitle, sectionSubtitle,
      products[]->{ name, "slug": slug.current, tagline, keyBenefit, badge, tier, comfortLevel, comfortRating, totalThickness, pricingModel, pricing, image { asset->{_id, url}, alt }, images[]{ asset->{_id, url}, alt } },
      viewAllCta { label, link }
    },
    costComparison { sectionTitle, sectionSubtitle, naturalLatex { label, avgPrice, lifespan, perYearCost, perDayCost, highlighted }, ordinaryFoam { label, avgPrice, lifespan, perYearCost, perDayCost }, footnote },
    showroomCtaBanner { title, locationName, address, backgroundImage { asset->{_id, url}, alt }, cta { label, link, variant } },
    whyChooseUs { sectionTitle, sectionSubtitle, benefits[]{ title, description, icon } },
    testimonialsSection { sectionTitle, overallRating, totalReviews,
      testimonials[]->{ customerName, location, rating, quote, isVerified, avatar { asset->{_id, url}, alt } }
    },
    allShowroomsSection { sectionTitle, sectionDescription,
      showrooms[]->{ city, address, phones, hours, image { asset->{_id, url}, alt } }
    },
    faqSection { sectionTitle, sectionDescription, categories,
      faqs[]->{ question, answer, category, order }
    },
    comparisonSection { sectionTitle, sectionSubtitle, items[]{ relaxProTitle, icon, otherTitle, otherSubtext } },
    sleepStyleGuide { sectionTitle, sectionSubtitle,
      styles[]->{ title, "slug": slug.current, description, linkText, image { asset->{_id, url}, alt }, order }
    },
    engineeredPosture { sectionTitle,
      categories[]{ title, subtitle, description, items, linkText, slug, image { asset->{_id, url}, alt } }
    },
    quickConnect { items[]{ label, icon, link } },
    featuredComponents { sectionTitle,
      components[]{ title, description, badge, image { asset->{_id, url}, alt } }
    }
  }`)
}

export async function getAllProducts() {
  return sanityClient.fetch(`*[_type == "product" && inStock == true] | order(sortOrder asc){
    name, "slug": slug.current, tagline, subtitle, keyBenefit, description, badge,
    warranty, comfortLevel, comfortRating, totalThickness,
    layers[]{ thickness, material, brand, certification, description },
    fabricGsm, fabricType, certifications, accessories,
    pricingModel,
    pricing { withAccessories, withoutAccessories, fabric300Gsm, fabric450Gsm },
    features, tier, rating, reviewCount,
    isBestseller, isNew, isFeatured, sortOrder,
    image { asset->{ _id, url }, alt },
    images[]{ asset->{ _id, url }, alt },
    category->{ name, "slug": slug.current },
    "metaTitle": seo.metaTitle, "metaDescription": seo.metaDescription
  }`)
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      name, tagline, subtitle, keyBenefit, description, shortDescription, longDescription,
      badge, badges, warranty, tier, comfortLevel, comfortRating, totalThickness,
      layers[]{ thickness, material, brand, certification, description },
      fabricGsm, fabricType, certifications, accessories,
      pricingModel,
      pricing { withAccessories, withoutAccessories, fabric300Gsm, fabric450Gsm },
      features, rating, reviewCount, isBestseller, isNew, isFeatured, inStock, sortOrder,
      image { asset->{ _id, url }, alt },
      images[]{ asset->{ _id, url }, alt },
      "metaTitle": seo.metaTitle, "metaDescription": seo.metaDescription,
      category->{ name, "slug": slug.current },
      relatedProducts[]->{ name, "slug": slug.current, tagline, pricingModel, pricing, rating, image { asset->{_id, url}, alt } }
    }`,
    { slug }
  )
}

export async function getProductPricing(slug: string) {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ pricingModel, pricing }`,
    { slug }
  )
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "about"][0]{
    hero, ourStory, ourProcess, certifications, values, teamSection,
    seo { metaTitle, metaDescription, ogImage }
  }`)
}

export async function getContactPage() {
  return sanityClient.fetch(`*[_type == "contact"][0]{
    heading, description, formFields,
    seo { metaTitle, metaDescription }
  }`)
}

export async function getProductsPage() {
  return sanityClient.fetch(`*[_type == "productsPage"][0]{
    pageTitle, pageDescription,
    "products": products[]->{ name, "slug": slug.current, tagline, keyBenefit, badge, tier, comfortLevel, comfortRating, totalThickness, pricingModel, pricing, features, image { asset->{_id, url}, alt }, isBestseller, isNew },
    seo { metaTitle, metaDescription }
  }`)
}

export async function getBrandCategories() {
  return sanityClient.fetch(`*[_type == "brandCategory"] | order(order asc){
    name, "slug": slug.current, description, image { asset->{_id, url}, alt }
  }`)
}

export async function getFaqs() {
  return sanityClient.fetch(`*[_type == "faq"] | order(order asc){
    question, answer, category, order
  }`)
}

export async function getTestimonials() {
  return sanityClient.fetch(`*[_type == "testimonial" && featured == true] | order(order asc){
    customerName, location, rating, quote, isVerified,
    avatar { asset->{_id, url}, alt },
    productPurchased->{ name, "slug": slug.current }
  }`)
}

export async function getAllShowrooms() {
  return sanityClient.fetch(`*[_type == "showroom"] | order(order asc){
    city, address, phones, hours, image { asset->{_id, url}, alt }
  }`)
}

export async function getBuilderData() {
  return sanityClient.fetch(`*[_type == "customBuilder"][0]{
    header { title, subtitle, trustChips },
    sizes[]{ name, lengthInches, widthInches, basePrice, popular },
    customSize { enabled, unit, minLength, maxLength, minWidth, maxWidth, pricePerSqInch, cutCharge, helper },
    steps { sizeTitle, sizeHelper, comfortTitle, comfortHelper, supportTitle, supportHelper, coverTitle, coverHelper },
    summaryPanel { heading, emptySlotText, emiNote, perks },
    ctas { primaryLabel, secondaryLabel, disabledHint },
    defaults { sizeName, comfortMaterialSlug, comfortThickness, supportMaterialSlug, supportThickness, coverFabricSlug, quiltingSlug },
    seo { metaTitle, metaDescription },
    "materials": *[_type=="builderMaterial" && isActive==true] | order(order asc){
      name, "slug": slug.current, slot, brand, density, ild, feelTag, benefit, tooltip,
      thicknessOptions, stackColor, isRecommended, image { asset->{_id, url}, alt }
    },
    "fabrics": *[_type=="builderFabric" && isActive==true] | order(order asc){
      name, "slug": slug.current, role, gsm, quiltingMm, benefit, addPrice, isRecommended, image { asset->{_id, url}, alt }
    }
  }`)
}

export async function getSleepScience() {
  return sanityClient.fetch(`*[_type == "sleepScience"][0]{
    title, badge, heading, intro,
    tabs[]{ label, content },
    comparisonSection { badge, heading, description, columns, rows[] },
    orthopedicSection { badge, heading, content },
    certifications[]{ title, description, image { asset->{_id, url}, alt } },
    ctaBadge, ctaHeading, ctaDescription, ctaLabel, ctaLink,
    seo { metaTitle, metaDescription }
  }`)
}

export async function getLocations() {
  return sanityClient.fetch(`*[_type == "showroom"] | order(order asc){
    city, address, phones, hours, mapLink, image { asset->{_id, url}, alt }
  }`)
}

export async function getPolicyPage(slug: string) {
  return sanityClient.fetch(
    `*[_type == "policyPage" && slug.current == $slug][0]{
      title, content, seo { metaTitle, metaDescription }
    }`,
    { slug }
  )
}

export async function getGallery(slug: string) {
  return sanityClient.fetch(
    `*[_type == "gallery" && slug.current == $slug][0]{
      title, images[]{ asset->{_id, url}, alt }
    }`,
    { slug }
  )
}

export async function getSleepStyles() {
  return sanityClient.fetch(`*[_type == "sleepStyle"] | order(order asc){
    title, "slug": slug.current, description, linkText, image { asset->{_id, url}, alt }
  }`)
}

export async function getAllProductsBasic() {
  return sanityClient.fetch(`*[_type == "product" && inStock == true] | order(sortOrder asc){
    name, "slug": slug.current, tier, comfortLevel, pricingModel,
    pricing { withAccessories, withoutAccessories, fabric300Gsm, fabric450Gsm },
    image { asset->{_id, url}, alt },
    isBestseller, isNew, totalThickness, rating, reviewCount,
    category->{ name, "slug": slug.current }
  }`)
}
