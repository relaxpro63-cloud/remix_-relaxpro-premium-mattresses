export type MattressSize = 'king' | 'queen' | 'double' | 'single';
export type ComfortLevel = 'firm' | 'medium-firm' | 'medium' | 'medium-soft' | 'soft-medium' | 'plush';
export type Tier = 'luxury' | 'premium' | 'comfort';
export type PricingModel = 'with_without_accessories' | 'fabric_options';

export interface MattressLayer {
  thickness: number;       // inches
  material: 'rebonded_foam' | 'latex' | 'hr_foam' | 'hr_softy_foam' | 'latex_rebonded' | 'pu_rebonded';
  brand?: string;
  certification?: string[];
  description: string;
}

export interface SizePrice {
  king: number;
  queen: number;
  double: number;
  single: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  subtitle: string;
  warranty: number;
  comfortLevel: ComfortLevel;
  comfortRating: number;   // 1 to 5 scale
  totalThickness: number;  // inches
  layers: MattressLayer[];
  fabricGsm: number;
  fabricType: string;
  certifications: string[];
  accessories: string[];
  keyBenefit: string;
  badge?: string;
  pricingModel: PricingModel;
  pricing: {
    withAccessories?: SizePrice;
    withoutAccessories?: SizePrice;
    fabric300Gsm?: SizePrice;
    fabric450Gsm?: SizePrice;
  };
  image: string;
  images: string[];
  tier: Tier;
  features: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface CartItem {
  id: string; // Unique timestamp/id
  slug: string;
  name: string;
  size: MattressSize;
  price: number;
  quantity: number;
  includeAccessories: boolean;
  fabricOption?: '300GSM' | '450GSM';
  image: string;
  type: 'prebuilt' | 'custom';
  customLayers?: {
    material: string;
    thickness: number;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  product: string;
}

export interface LeadFormData {
  orderId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  pincode?: string;
  contactTime?: string;
  product?: string;
  size?: string;
  price?: string | number;
  notes?: string;
  source?: string;
}

export interface OrderReceipt {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  contactTime: string;
  notes: string;
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
  cart: CartItem[];
}
