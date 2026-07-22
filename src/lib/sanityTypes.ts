export interface SanityImage {
  _type: 'image'
  asset: { _type: 'reference'; _ref: string; _id?: string; url?: string }
  alt?: string
  caption?: string
}

export interface SanityCta {
  label: string
  link: string
  variant?: 'primary' | 'secondary' | 'ghost'
  openInNewTab?: boolean
}

export interface SanitySeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  keywords?: string[]
  noIndex?: boolean
  canonical?: string
}

export interface SanityLayer {
  thickness: number
  material: 'rebonded_foam' | 'latex' | 'hr_foam' | 'hr_softy_foam' | 'latex_rebonded' | 'pu_rebonded'
  brand?: string
  certification?: string[]
  description: string
}

export interface SanitySizePrice {
  king?: number
  queen?: number
  double?: number
  single?: number
  diwan?: number
  custom?: number
}

export interface SanityPricing {
  withAccessories?: SanitySizePrice
  withoutAccessories?: SanitySizePrice
  fabric300Gsm?: SanitySizePrice
  fabric450Gsm?: SanitySizePrice
  startingPrice?: number
  mrp?: number
  currency?: string
}

export interface SanityProduct {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  subtitle?: string
  keyBenefit?: string
  description?: string
  shortDescription?: string
  badge?: string
  warranty?: number
  comfortLevel?: string
  comfortRating?: number
  totalThickness?: number
  layers?: SanityLayer[]
  fabricGsm?: number
  fabricType?: string
  certifications?: string[]
  accessories?: string[]
  pricingModel?: 'with_without_accessories' | 'fabric_options'
  pricing: SanityPricing
  features?: string[]
  image?: SanityImage
  images?: SanityImage[]
  thumbnail?: SanityImage
  tier?: 'luxury' | 'premium' | 'comfort'
  isBestseller?: boolean
  isNew?: boolean
  isFeatured?: boolean
  inStock?: boolean
  rating?: number
  reviewCount?: number
  sortOrder?: number
  category?: { name: string; slug: string }
  tags?: string[]
  relatedProducts?: any[]
  metaTitle?: string
  metaDescription?: string
}

export interface SanityNavigationItem {
  label: string
  path: string
  icon?: string
  isCta?: boolean
  children?: { label: string; path: string; description?: string }[]
}

export interface SanityFooterColumn {
  heading: string
  links: { label: string; path: string }[]
}

export interface SanityNavigation {
  desktopMenu: SanityNavigationItem[]
  mobileMenu: { label: string; path: string }[]
  footerMenu: SanityFooterColumn[]
}

export interface SanitySiteSettings {
  branding: {
    siteName: string
    tagline: string
    logo?: SanityImage
    favicon?: any
  }
  navigation: {
    mainMenu: any[]
    footerMenu: any[]
    ctaButton?: SanityCta
    phoneNumber?: string
  }
  footer: {
    description?: string
    socialLinks: { platform: string; url: string; icon?: string }[]
    certifications: { name: string; image?: SanityImage }[]
    copyrightText?: string
  }
  contactInfo: {
    mainPhone?: string
    secondaryPhone?: string
    whatsappNumber?: string
    whatsappDefaultMessage?: string
    email?: string
    factoryAddress?: string
  }
  announcement: {
    showBanner: boolean
    bannerText?: string
    bannerLink?: string
    bannerColor?: string
  }
  staticImages?: {
    gotsCotton?: SanityImage
    quiltedCotton?: SanityImage
    naturalLatex?: SanityImage
    comfortMeter?: SanityImage
    sizeChart?: SanityImage
    heroBedroom?: SanityImage
  }
  seo?: SanitySeo
  analytics?: {
    gaTrackingId?: string
    metaPixelId?: string
    gtmId?: string
  }
}

export interface SanityHeroSlide {
  image?: SanityImage
  badge?: string
  heading?: string
  highlight?: string
  subheading?: string
  description?: string
  primaryCta?: SanityCta
  secondaryCta?: SanityCta
  trustBadges?: { text: string; icon?: string }[]
}

export interface SanityTestimonial {
  customerName: string
  location?: string
  rating: number
  quote: string
  isVerified?: boolean
  avatar?: SanityImage
  productPurchased?: { name: string; slug: string }
}

export interface SanityFaq {
  question: string
  answer: any[]
  category?: string
  order?: number
}

export interface SanityShowroom {
  city: string
  address: string
  phones: string[]
  hours: string
  image?: SanityImage
  mapLink?: string
}

export interface SanitySleepScience {
  title?: string
  badge?: string
  heading?: string
  intro?: string
  tabs?: { label: string; content: any[] }[]
  comparisonSection?: {
    badge?: string
    heading?: string
    description?: string
    columns?: { criteria: string; latex: string; foam: string }
    rows?: { criteria: string; latex: string; foam: string }[]
  }
  orthopedicSection?: { badge?: string; heading?: string; content: any[] }
  certifications?: { title: string; description: string; image?: SanityImage }[]
  ctaBadge?: string
  ctaHeading?: string
  ctaDescription?: string
  ctaLabel?: string
  ctaLink?: string
  seo?: SanitySeo
}

export type MattressSize = 'king' | 'queen' | 'double' | 'single' | '72x36' | '75x36' | '78x36' | '72x48' | '75x48' | '78x48' | '72x60' | '75x60' | '78x60' | '72x66' | '75x66' | '78x66' | '72x72' | '75x72' | '78x72' | 'custom'
export type ComfortLevel = 'firm' | 'medium-firm' | 'medium' | 'medium-soft' | 'soft-medium' | 'plush'
export type Tier = 'luxury' | 'premium' | 'comfort'
export type PricingModel = 'with_without_accessories' | 'fabric_options'
export type SizeCategory = 'single' | 'diwan' | 'queen' | 'queen_xl' | 'king'
