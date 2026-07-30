# RelaxPro Sanity Content Seeder

## Prerequisites

1. **Sanity API Token** — Generate a write token from:
   https://www.sanity.io/manage → Project `de6mndac` → API → Tokens → Add API token
   (Select "Editor" role for write access)

2. **Node.js 20+** — Ensure you have Node.js installed

## Single Command Seed

```bash
cd relaxpro-studio/studio

# Set your Sanity token
export SANITY_AUTH_TOKEN="skYOUR_TOKEN_HERE"

# Run the comprehensive seeder
node seed/seed-all.mjs
```

**Windows (PowerShell):**
```powershell
cd relaxpro-studio\studio
$env:SANITY_AUTH_TOKEN="skYOUR_TOKEN_HERE"
node seed/seed-all.mjs
```

**Windows (CMD):**
```cmd
cd relaxpro-studio\studio
set SANITY_AUTH_TOKEN=skYOUR_TOKEN_HERE
node seed/seed-all.mjs
```

## What Gets Seeded

| # | Content Type | Documents |
|---|-------------|----------|
| 1 | Categories | Luxury, Premium, Comfort (3) |
| 2 | Products | Nirvana, Amrita, Ananda, Prakriti, Somya, Arogya, Shuddha, Sthira, Bhumi, Sunidra, Vishram, Ojas, AyushRest (13) |
| 3 | Testimonials | Real customer reviews with names, ratings, locations (15) |
| 4 | FAQs | 20 questions across 5 categories |
| 5 | Showrooms | Hyderabad Factory, Rajahmundry Experience, Bangalore Partner (3) |
| 6 | Accessories | Latex Pillow, Shredded Pillow, Fiber Pillow, Mattress Protector (4) |
| 7 | Offers | Factory Direct, Free Accessories, Comfort Collection (3) |
| 8 | Policy Pages | Privacy Policy, Terms & Conditions, Warranty (3) |
| 9 | Sleep Styles | Side, Back, Stomach, Combination, Orthopedic, Luxury (6) |
| 10 | Certifications | GOLS, OEKO-TEX, ISO, FSC, ECO-Institut (5) |
| 11 | Builder Data | Config + 6 materials + 4 fabrics |
| 12 | Navigation | Desktop menu, Mobile menu, Footer menu |
| 13 | Hero | Full hero slides with CTAs and trust badges |
| 14 | Site Settings | Branding, contact, social, announcement, analytics, popup |
| 15 | Homepage | Complete with all 18+ sections |
| 16 | About | Company story, process, values |
| 17 | Contact | Form configuration, map, hours |
| 18 | Products Page | All 13 products listed |
| 19 | Sleep Science | Tabs, comparisons, certifications |
| 20 | Locations | Hyderabad, Rajahmundry, Bangalore (3) |
| 21 | Galleries | Product Showcase, Showroom Gallery (2) |

## Image Upload

Images from `public/images/` are automatically uploaded to Sanity's CDN during seeding.

A cache file (`seed/image-cache.json`) is maintained so re-running the seed doesn't re-upload images.

## Re-running

The script uses `createOrReplace`, so it's safe to re-run. It will update existing documents and create missing ones.

## Troubleshooting

- `SANITY_AUTH_TOKEN required` → Set the environment variable
- `Failed "product: Nirvana"` → Check token has write permissions
- Image upload failures → Check file exists in `public/images/`
