export type SizeCategory = 'single' | 'diwan' | 'queen' | 'king';

interface SizeVariant {
  label: string;
  dims: { length: number; width: number };
  legacyKey: string;
}

export const STANDARD_SIZES: Record<SizeCategory, { label: string; variants: SizeVariant[] }> = {
  single: {
    label: 'Single',
    variants: [
      { label: '72" × 36"', dims: { length: 72, width: 36 }, legacyKey: '72x36' },
      { label: '75" × 36"', dims: { length: 75, width: 36 }, legacyKey: '75x36' },
      { label: '78" × 36"', dims: { length: 78, width: 36 }, legacyKey: '78x36' },
    ],
  },
  diwan: {
    label: 'Diwan / Double',
    variants: [
      { label: '72" × 48"', dims: { length: 72, width: 48 }, legacyKey: '72x48' },
      { label: '75" × 48"', dims: { length: 75, width: 48 }, legacyKey: '75x48' },
      { label: '78" × 48"', dims: { length: 78, width: 48 }, legacyKey: '78x48' },
    ],
  },
  queen: {
    label: 'Queen',
    variants: [
      { label: '72" × 60"', dims: { length: 72, width: 60 }, legacyKey: '72x60' },
      { label: '75" × 60"', dims: { length: 75, width: 60 }, legacyKey: '75x60' },
      { label: '78" × 60"', dims: { length: 78, width: 60 }, legacyKey: '78x60' },
    ],
  },

  king: {
    label: 'King',
    variants: [
      { label: '72" × 72"', dims: { length: 72, width: 72 }, legacyKey: '72x72' },
      { label: '75" × 72"', dims: { length: 75, width: 72 }, legacyKey: '75x72' },
      { label: '78" × 72"', dims: { length: 78, width: 72 }, legacyKey: '78x72' },
    ],
  },
};

export const SIZE_CATEGORIES: { value: SizeCategory; label: string; hint: string }[] = [
  { value: 'single', label: 'Single', hint: '36" wide' },
  { value: 'diwan', label: 'Diwan / Double', hint: '48" wide' },
  { value: 'queen', label: 'Queen', hint: '60" wide' },

  { value: 'king', label: 'King', hint: '72" wide' },
];
