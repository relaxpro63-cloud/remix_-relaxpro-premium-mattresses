export type MattressSize = 'king' | 'queen' | 'double' | 'single' | '72x36' | '75x36' | '78x36' | '72x48' | '75x48' | '78x48' | '72x60' | '75x60' | '78x60' | '72x66' | '75x66' | '78x66' | '72x72' | '75x72' | '78x72' | 'custom';
export type ComfortLevel = 'firm' | 'medium-firm' | 'medium' | 'medium-soft' | 'soft-medium' | 'plush';
export type Tier = 'luxury' | 'premium' | 'comfort';
export type PricingModel = 'with_without_accessories' | 'fabric_options';
export type SizeCategory = 'single' | 'diwan' | 'queen' | 'queen_xl' | 'king';

export interface MattressLayer {
  thickness: number; // inches
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
  diwan?: number;
  '72x36'?: number;
  '75x36'?: number;
  '78x36'?: number;
  '72x48'?: number;
  '75x48'?: number;
  '78x48'?: number;
  '72x60'?: number;
  '75x60'?: number;
  '78x60'?: number;
  '72x66'?: number;
  '75x66'?: number;
  '78x66'?: number;
  '72x72'?: number;
  '75x72'?: number;
  '78x72'?: number;
  custom?: 0;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  subtitle: string;
  warranty: number;
  comfortLevel: ComfortLevel;
  comfortRating: number; // 1 to 5 scale
  totalThickness: number; // inches
  layers: MattressLayer[];
  fabricGsm: number;
  fabricType: string;
  certifications: string[];
  accessories: string[];
  keyBenefit: string;
  description: string;
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
  customSize?: { length: number; width: number; thickness?: number };
  sizeCategory?: SizeCategory;
  customLayers?: { material: string; thickness: number }[];
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
