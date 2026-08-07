export interface MattressCategory {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  products: Array<{ slug: string; name: string; note: string }>;
  related: Array<{ label: string; path: string }>;
}

export const MATTRESS_CATEGORIES: MattressCategory[] = [
  {
    slug: 'latex-mattress',
    title: 'Latex Mattress | Premium Latex Mattress by RelaxPro',
    metaDescription:
      'Latex mattresses built from GOLS-certified natural rubber latex. 90-density Kerala latex, Dunlop processed, handcrafted in Hyderabad and delivered factory-direct across India.',
    h1: 'Latex Mattress',
    eyebrow: 'Latex Sleep Technology',
    intro:
      'A latex mattress is built from natural rubber latex — a material that gives you pressure relief, breathability and resilience without synthetic foam fillers. RelaxPro makes latex mattresses with 90-density, GOLS-certified Kerala latex, handcrafted in Hyderabad and shipped direct to your doorstep.',
    sections: [
      {
        heading: 'What is a latex mattress?',
        paragraphs: [
          'Natural latex comes from the sap of rubber trees. In our Dunlop process the sap is filtered, whipped and baked in molds, preserving latex\'s natural cellular structure — the open-air channels that make it breathe and rebound instead of caving in.',
          'Unlike memory foam, which slowly sinks under body weight, latex is naturally resilient: it pushes back with the right amount of support, which is why sleepers describe it as "floating" rather than "sinking".',
        ],
        bullets: [
          '90-density natural latex core — firmer, more supportive than soft-fill mattresses',
          'Open-cell structure stays cool through the night',
          'GOLS-certified organic material, zero synthetic fillers',
        ],
      },
      {
        heading: 'Why it sleeps better',
        paragraphs: [
          'Latex distributes body weight evenly across the sleep surface, reducing pressure on shoulders, hips and the lower back. Its natural elasticity keeps the spine in neutral alignment through the night.',
          'Natural latex is also naturally hypoallergenic and resistant to dust mites, making it a strong choice for allergy-prone sleepers. It lasts significantly longer than polyurethane foam cores, which is why latex mattresses stay supportive for over a decade.',
        ],
      },
      {
        heading: 'The RelaxPro difference',
        paragraphs: [
          'Every RelaxPro latex mattress uses pure GOLS-certified organic Kerala latex — no synthetic rubber, no filler, no harmful VOCs. The core is built in our factory in Hyderabad and finished with GOTS-certified organic cotton covers.',
          'Because we manufacture and sell directly, you get a handcrafted latex mattress at factory-direct pricing, with free shipping and tax included.',
        ],
      },
    ],
    products: [
      { slug: 'nirvana', name: 'Nirvana 6" Pure Natural Latex', note: '100% latex construction with 96.6% GOLS-certified purity' },
      { slug: 'ananda', name: 'Ananda 6" Solid Latex', note: 'GOLS + OEKO-TEX certified pure organic latex' },
    ],
    related: [
      { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
      { label: 'Rebonded Mattress', path: '/rebonded-mattress' },
      { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
      { label: 'Why Latex?', path: '/science' },
    ],
  },
  {
    slug: 'natural-latex-mattress',
    title: 'Natural Latex Mattress | 100% Pure Organic Latex',
    metaDescription:
      '100% natural latex mattresses — 96.6% pure GOLS-certified Kerala latex with no synthetic rubber or fillers. Handcrafted in Hyderabad, factory-direct across India.',
    h1: 'Natural Latex Mattress',
    eyebrow: '100% Pure Organic Latex',
    intro:
      'A natural latex mattress is made from pure rubber-tree sap with nothing synthetic added. RelaxPro\'s natural latex mattresses use 96.6% pure GOLS-certified Kerala latex — no synthetic rubber, no chemical fillers, no volatile compounds. Just natural latex, Dunlop processed and handcrafted in India.',
    sections: [
      {
        heading: 'What "100% natural" really means',
        paragraphs: [
          'Many mattresses labelled "latex" blend natural latex with synthetic rubber (SBR) or fillers to cut cost. A truly natural latex mattress contains only the sap of the rubber tree, processed without synthetic stabilizers.',
          'Our natural latex carries the GOLS (Global Organic Latex Standard) certification for organic latex integrity — the strongest independent proof that what is inside the mattress is genuinely organic.',
        ],
        bullets: [
          '96.6% pure GOLS-certified natural latex',
          'Zero synthetic rubber, zero fillers, zero VOCs',
          'Dunlop-processed in small batches to preserve the latex\'s natural structure',
        ],
      },
      {
        heading: 'Breathable, hypoallergenic, long-lasting',
        paragraphs: [
          'Natural latex\'s open-cell structure circulates air, drawing heat and moisture away from your body. Because it contains no petrochemicals, it is naturally resistant to dust mites and allergens — a real benefit for sensitive sleepers.',
          'With proper care, a natural latex mattress outlasts conventional foam mattresses many times over, holding its support and bounce for over a decade.',
        ],
      },
      {
        heading: 'Crafted in Hyderabad, certified end to end',
        paragraphs: [
          'The latex core is produced at our Kerala unit and finished at our Jeedimetla factory in Hyderabad with GOTS-certified organic cotton quilting. Every mattress is compression-rolled and shipped directly to your door — factory-direct, free shipping, tax included.',
        ],
      },
    ],
    products: [
      { slug: 'nirvana', name: 'Nirvana 6" Pure Natural Latex', note: '90 density, 96.6% GOLS-certified pure natural latex' },
      { slug: 'ananda', name: 'Ananda 6" Solid Latex', note: 'GOLS + OEKO-TEX certified 100% pure organic latex' },
      { slug: 'prakriti', name: 'Prakriti 8" Eco & Natural Latex', note: 'Upcycled eco-rebonded core under pure certified latex' },
      { slug: 'shuddha', name: 'Shuddha 6" Eco Latex', note: 'ECO-Institut certified latex-rebonded core with GOLS topper' },
    ],
    related: [
      { label: 'Latex Mattress', path: '/latex-mattress' },
      { label: 'HR Foam Mattress', path: '/hr-foam-mattress' },
      { label: 'Custom Size Mattress', path: '/custom-size-mattress' },
      { label: 'Why Latex?', path: '/science' },
    ],
  },
  {
    slug: 'hr-foam-mattress',
    title: 'HR Foam Mattress | Highly Resilient Foam Mattresses',
    metaDescription:
      'HR foam mattresses with high-resilience, highly responsive foam layers — Century AirFlow HR softy and HR ortho. Firm support with a quick rebound, handcrafted by RelaxPro.',
    h1: 'HR Foam Mattress',
    eyebrow: 'High-Resilience Foam',
    intro:
      'HR foam — short for high-resilience foam — is a firm, highly responsive cushioning foam that springs back quickly under pressure. RelaxPro uses HR foam in supportive transition and comfort layers of our hybrid mattresses, paired with natural latex for a balanced, breathable sleep surface.',
    sections: [
      {
        heading: 'What is HR foam?',
        paragraphs: [
          'High-resilience (HR) foam is engineered for rebound. Unlike memory foam that slowly deforms, HR foam returns to shape immediately, giving you firm, energetic support with less heat retention.',
          'In our builds, HR foam appears as cushioning and support layers — from the "Century AirFlow" HR softy transition foam to firm "HR Ortho" support foam used in our most supportive models.',
        ],
        bullets: [
          'Quick rebound — no sinking, no body impressions',
          'High-density, breathable structure that sleeps cooler than memory foam',
          'Adds firm orthopedic support when paired with a rebonded base',
        ],
      },
      {
        heading: 'Where we use HR foam',
        paragraphs: [
          'HR softy foam layers sit between the firm rebonded base and the latex comfort layer in models like Somya, Sunidra and Vishram, smoothing the transition from firm support to plush comfort.',
          'For heavy-duty orthopedic builds, firm HR foam is used as a dedicated support layer — for example the Century Ortho HR layer in the Ayushrest model.',
        ],
      },
      {
        heading: 'HR foam vs latex vs memory foam',
        paragraphs: [
          'Memory foam conforms but sleeps warm and can sag. Latex conforms and stays cool but costs more. HR foam splits the difference: firm, resilient support with good airflow at an accessible price point. That is why our hybrids combine rebonded support, HR transition and natural latex comfort for the best of all three.',
        ],
      },
    ],
    products: [
      { slug: 'somya', name: 'Somya 10" Latex Hybrid', note: 'Rebonded base + Century AirFlow HR softy + 4" latex' },
      { slug: 'sunidra', name: 'Sunidra 8" Latex Hybrid', note: 'Firm rebonded base with HR softy transition + latex' },
      { slug: 'vishram', name: 'Vishram 7" Supportive Hybrid', note: '95-density rebonded base, responsive HR softy, 1" latex' },
      { slug: 'ojas', name: 'Ojas 6" Ultra-Firm', note: 'Ultra-firm rebonded base + highly responsive HR softy' },
      { slug: 'ayushrest', name: 'Ayushrest 8" Heavy Ortho', note: 'Extra-density rebonded, firm HR ortho + softy cushioning' },
    ],
    related: [
      { label: 'Rebonded Mattress', path: '/rebonded-mattress' },
      { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
      { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
      { label: 'Custom Size Mattress', path: '/custom-size-mattress' },
    ],
  },
  {
    slug: 'rebonded-mattress',
    title: 'Rebonded Mattress | High-Density Rebonded Base',
    metaDescription:
      'Rebonded mattresses with 90-95 density high-density foam bases that resist sagging for over a decade. Explore RelaxPro hybrid models with rebonded support cores.',
    h1: 'Rebonded Mattress',
    eyebrow: 'High-Density Support Base',
    intro:
      'A rebonded mattress uses a rebonded foam core — shredded foam bonded under heat and pressure into a dense, rock-solid base. Rebonded foam gives a mattress a firm foundation that never sags, making it the support layer of choice in our hybrid latex builds.',
    sections: [
      {
        heading: 'What is rebonded foam?',
        paragraphs: [
          'Rebonded foam is made by compressing and bonding shredded foam offcuts into high-density sheets. The result is an extremely dense, firm support core — typically 90 to 95 density in our mattresses — that holds its shape under heavy weight for years.',
          'We use branded Century rebonded foam, available in extra-firm and ortho-specific grades, as the base layer beneath natural latex comfort layers.',
        ],
        bullets: [
          '90-95 density rebonded base — zero structural deflection, no sagging',
          'Firm orthopedic foundation that supports heavier body weights',
          'Bonded to a natural latex topper for firm support with plush comfort',
        ],
      },
      {
        heading: 'Rebonded base + latex comfort',
        paragraphs: [
          'The classic RelaxPro hybrid pairs a thick rebonded base with a natural latex comfort layer. The rebonded core provides the rock-solid foundation; the latex delivers contouring and pressure relief on top.',
          'Models like Amrita and Arogya use this construction — engineered so the mattress never sags while the latex layer reduces pressure points across shoulders, hips and lower back.',
        ],
      },
      {
        heading: 'Eco latex-rebonded cores',
        paragraphs: [
          'For a more sustainable twist, some models use latex-rebonded cores made from upcycled natural latex shreds — 120-density, ECO-Institut certified, and cast from shredded organic latex that would otherwise go to waste. Prakriti and Shuddha lead this eco construction.',
        ],
      },
    ],
    products: [
      { slug: 'amrita', name: 'Amrita 10" Rebonded + Latex', note: '4" Century rebonded base under 6" GOLS latex' },
      { slug: 'arogya', name: 'Arogya 8" Ortho Hybrid', note: 'High-firm Century rebonded + certified latex core' },
      { slug: 'sthira', name: 'Sthira 6" Firm Ortho', note: '95-density ortho rebonded base + GOLS latex' },
      { slug: 'bhumi', name: 'Bhumi 8" Supportive Hybrid', note: 'PU rebonded base + eco latex-rebonded transition' },
      { slug: 'prakriti', name: 'Prakriti 8" Eco Latex', note: 'ECO-Institut certified eco latex-rebonded core' },
    ],
    related: [
      { label: 'HR Foam Mattress', path: '/hr-foam-mattress' },
      { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
      { label: 'Latex Mattress', path: '/latex-mattress' },
      { label: 'Custom Size Mattress', path: '/custom-size-mattress' },
    ],
  },
  {
    slug: 'orthopedic-mattress',
    title: 'Orthopedic Mattress | Firm Supportive Mattresses',
    metaDescription:
      'Orthopedic mattresses engineered for spine alignment — firm rebonded bases, high-resilience foam and natural latex. Free clinical posture audit with RelaxPro.',
    h1: 'Orthopedic Mattress',
    eyebrow: 'Firm Support, Spine Alignment',
    intro:
      'An orthopedic mattress is engineered to keep your spine in neutral alignment by providing firm, even support — especially in the hips and lower back. RelaxPro\'s orthopedic range pairs firm rebonded bases and high-resilience foam with natural latex comfort for sleepers who need extra support for back health.',
    sections: [
      {
        heading: 'What makes a mattress orthopedic?',
        paragraphs: [
          'Orthopedic mattresses are firmer than average so that the heaviest parts of the body — the hips and shoulders — do not sink too deeply, keeping the spine straight through the night.',
          'Our orthopedic models combine 90-95 density rebonded support bases with high-resilience HR foam. The firm base carries the weight; the resilient foam responds without caving in, so side sleepers and back sleepers both keep a neutral posture.',
        ],
        bullets: [
          'Firm comfort profiles rated on a visible comfort scale',
          'High-density rebonded bases that never sag',
          'Designed for back-pain relief and doctor-recommended support',
        ],
      },
      {
        heading: 'A clinical posture audit, not a sales pitch',
        paragraphs: [
          'Firmness is personal. When you connect with Suresh — RelaxPro\'s founder — he analyses mattress hardness, sleep postures and medical back histories to recommend the ideal model, free of charge.',
          'That is why every RelaxPro mattress is labelled with a comfort rating: you can compare firmness honestly before you buy, instead of guessing from marketing language.',
        ],
      },
      {
        heading: 'Our most supportive models',
        paragraphs: [
          'For heavy ortho support, the Ojas and Ayushrest models lead the range — ultra-firm rebonded bases with responsive HR foam. Arogya and Sthira offer firm hybrid support with certified latex comfort layers.',
        ],
      },
    ],
    products: [
      { slug: 'ojas', name: 'Ojas 6" Ultra-Firm', note: 'Ultra-firm Century ortho rebonded + responsive HR softy' },
      { slug: 'ayushrest', name: 'Ayushrest 8" Heavy Ortho', note: 'Extra-density rebonded + firm HR ortho foam' },
      { slug: 'arogya', name: 'Arogya 8" Ortho Hybrid', note: 'High-firm rebonded support + certified organic latex' },
      { slug: 'sthira', name: 'Sthira 6" Firm Ortho', note: '95-density ortho rebonded + GOLS-certified latex' },
    ],
    related: [
      { label: 'Rebonded Mattress', path: '/rebonded-mattress' },
      { label: 'HR Foam Mattress', path: '/hr-foam-mattress' },
      { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
      { label: 'Book a Posture Audit', path: '/contact' },
    ],
  },
  {
    slug: 'custom-size-mattress',
    title: 'Custom Size Mattress | Made-to-Measure Mattresses',
    metaDescription:
      'Custom size mattresses made to your exact dimensions — 48" to 96" long, 24" to 84" wide, optional thickness. Same certified latex construction, factory-direct pricing.',
    h1: 'Custom Size Mattress',
    eyebrow: 'Made-to-Measure',
    intro:
      'Standard sizes never fit every bed frame. RelaxPro builds custom size mattresses to your exact dimensions — from 48" to 96" in length and 24" to 84" in width, with optional thickness — using the same certified latex, HR foam and rebonded constructions as our standard range.',
    sections: [
      {
        heading: 'Made to your measurements',
        paragraphs: [
          'Give us your length, width and (optional) thickness and we will build a mattress to fit — whether it is for a loft bed, a built-in frame, a caravan, an odd-shaped room, or a size that simply is not on the shelf.',
          'Custom sizes carry the same GOLS-certified latex options, the same GOTS organic cotton covers, and the same factory-direct quality as our standard models.',
        ],
        bullets: [
          'Length: 48" to 96"',
          'Width: 24" to 84"',
          'Thickness: 4" to 14" (optional)',
          'Natural latex, HR foam or rebonded constructions available',
        ],
      },
      {
        heading: 'How ordering works',
        paragraphs: [
          'Use our interactive builder to select your custom size and mattress layers, or simply send your dimensions to our team on WhatsApp for a quote. Because we manufacture in-house in Hyderabad, custom builds are delivered directly to your door with free shipping.',
          'Custom pricing is on request — our team will confirm the exact price for your dimensions before you commit.',
        ],
      },
      {
        heading: 'Why choose a made-to-measure mattress',
        paragraphs: [
          'A mattress that matches your frame exactly eliminates gaps, prevents the mattress slipping, and gives you the full support surface you paid for. It is the difference between fitting the room and fitting the sleep.',
        ],
      },
    ],
    products: [],
    related: [
      { label: 'Custom Mattress Builder', path: '/builder' },
      { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
      { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
      { label: 'Browse the Catalog', path: '/catalog' },
    ],
  },
];
