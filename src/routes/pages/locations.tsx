import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import PageShell from '../../components/layout/PageShell';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
import { getLocations } from '../../lib/queries';
import { LOCATIONS as FALLBACK_LOCATIONS } from '../../data/products';
import { WHATSAPP_NUMBER, SITE_URL, toAbsoluteUrl, buildMapsUrl } from '../../lib/site';

function parseHoursRange(range: string | undefined): { open: string; close: string } | null {
  if (!range) return null;
  const m = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  const to24 = (h: number, meridiem: string) => {
    if (meridiem.toUpperCase() === 'AM') return h === 12 ? 0 : h;
    return h === 12 ? 12 : h + 12;
  };
  return {
    open: `${String(to24(+m[1], m[3])).padStart(2, '0')}:${m[2]}`,
    close: `${String(to24(+m[4], m[6])).padStart(2, '0')}:${m[5]}`,
  };
}

const DAY_NAMES: Array<[string, string]> = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
];

function openingHoursSpec(hours: unknown): any[] {
  if (!hours || typeof hours !== 'object') return [];
  const h = hours as Record<string, string | undefined>;
  const byRange: Record<string, string[]> = {};
  for (const [key, schemaDay] of DAY_NAMES) {
    const parsed = parseHoursRange(h[key]);
    if (!parsed) continue;
    const rangeKey = `${parsed.open}-${parsed.close}`;
    (byRange[rangeKey] = byRange[rangeKey] || []).push(schemaDay);
  }
  return Object.entries(byRange).map(([rangeKey, days]) => {
    const [open, close] = rangeKey.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens: open,
      closes: close,
    };
  });
}

const SHORT_DAYS: Record<string, string> = {
  Mon: 'Mo', Tue: 'Tu', Wed: 'We', Thu: 'Th', Fri: 'Fr', Sat: 'Sa', Sun: 'Su',
};

// Parse the legacy combined string form, e.g.
// "Mon - Sun: 10:00 AM - 9:00 PM"
// "Mon - Sat: 10:00 AM - 8:30 PM, Sun: 11:00 AM - 7:00 PM"
function parseFallbackHours(str: string | undefined): string[] {
  if (!str) return [];
  return str
    .split(',')
    .map((seg) => {
      const m = seg.match(/(\w{3})\s*-\s*(\w{3})\s*:\s*(.+)/);
      if (m) {
        const parsed = parseHoursRange(m[3]);
        if (!parsed) return null;
        return `${SHORT_DAYS[m[1]] || m[1]}-${SHORT_DAYS[m[2]] || m[2]} ${parsed.open}-${parsed.close}`;
      }
      const single = seg.match(/(\w{3})\s*:\s*(.+)/);
      if (single) {
        const parsed = parseHoursRange(single[2]);
        if (!parsed) return null;
        return `${SHORT_DAYS[single[1]] || single[1]} ${parsed.open}-${parsed.close}`;
      }
      return null;
    })
    .filter(Boolean) as string[];
}

function storeSchema(store: any): Record<string, unknown> {
  const city = store.address?.city || store.city || 'Showroom';
  const slug = store.slug || city.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'showroom';
  const addrObj = typeof store.address === 'object' && store.address !== null ? store.address : {};
  const fullAddress =
    addrObj.fullAddress ||
    addrObj.street ||
    store.fullAddress ||
    (typeof store.address === 'string' ? store.address : '');
  const phones = store.contact?.phoneNumbers || store.phones || [];
  const phone = phones[0] || store.telephone || '+919281424494';
  const email = store.contact?.email || store.email || '';
  const coords = store.coordinates || store.coords;
  const geo =
    coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
      ? { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng }
      : undefined;
  const pincode = addrObj.pincode || store.pincode || fullAddress.match(/\b\d{6}\b/)?.[0] || undefined;
  const openingHours = openingHoursSpec(store.hours);
  const openingHoursLegacy = parseFallbackHours(store.hours);

  return {
    '@type': 'Store',
    '@id': `${SITE_URL}/locations#${slug}`,
    name: `RelaxPro ${city} Store`,
    url: `${SITE_URL}/locations`,
    image: toAbsoluteUrl('/og-image.jpg'),
    telephone: phone,
    ...(email ? { email } : {}),
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: fullAddress,
      addressLocality: city,
      ...(pincode ? { postalCode: pincode } : {}),
      addressCountry: 'IN',
    },
    ...(geo ? { geo } : {}),
    ...(openingHours.length > 0
      ? { openingHoursSpecification: openingHours }
      : openingHoursLegacy.length > 0
        ? { openingHours: openingHoursLegacy }
        : {}),
  };
}

function buildStoreSchemas(showrooms: any[]): Record<string, unknown> {
  const stores = showrooms.map(storeSchema);
  if (stores.length <= 1) {
    return stores[0] || storeSchema(FALLBACK_LOCATIONS[0]);
  }
  return {
    '@context': 'https://schema.org',
    '@graph': stores,
  };
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [waNumber, setWaNumber] = useState(WHATSAPP_NUMBER);
  const [storeSchemas, setStoreSchemas] = useState<Record<string, unknown>>(() =>
    buildStoreSchemas(FALLBACK_LOCATIONS),
  );

  useEffect(() => {
    getLocations().then(data => {
      if (data && data.length > 0) {
        // Normalize Sanity data to match fallback structure
        const normalized = data.map((loc: any) => {
          // Normalize hours: object (Sanity schema) or flat string (legacy seed)
          let hoursDisplay = '';
          let hoursNote = '';
          if (typeof loc.hours === 'object' && loc.hours !== null) {
            const h = loc.hours;
            const dayHours = [h.monday, h.tuesday, h.wednesday, h.thursday, h.friday, h.saturday, h.sunday].filter(Boolean);
            if (dayHours.length > 0) {
              const unique = [...new Set(dayHours)];
              hoursDisplay = unique.length === 1 ? `Open: ${unique[0]}` : dayHours.join(' / ');
            }
            hoursNote = h.note || '';
          } else if (typeof loc.hours === 'string') {
            hoursDisplay = loc.hours;
          } else {
            hoursDisplay = '10:00 AM - 9:00 PM Daily';
          }
          // Normalize address: object (Sanity schema) or flat string (legacy seed)
          let cityName = loc.address?.city || loc.city || '';
          let fullAddr = '';
          if (typeof loc.address === 'object' && loc.address !== null) {
            fullAddr = loc.address.fullAddress || loc.address.street || '';
            // If no fullAddress but city is set, construct from parts
            if (!fullAddr && cityName) {
              const parts = [loc.address.street, loc.address.landmark, cityName, loc.address.state].filter(Boolean);
              fullAddr = parts.join(', ');
            }
          } else if (typeof loc.address === 'string') {
            fullAddr = loc.address;
          }
          return {
            city: cityName || 'Showroom',
            address: fullAddr,
            hours: hoursDisplay,
            hoursNote,
            phones: loc.contact?.phoneNumbers || loc.phones || [],
            coords: loc.coordinates,
          };
        });
        setLocations(normalized);
        setStoreSchemas(buildStoreSchemas(data));
      }
    }).catch(() => {});
  }, []);

  const displayLocations = locations.length > 0 ? locations : FALLBACK_LOCATIONS;

  return (
    <PageShell
      title="RelaxPro Factory Showrooms - Hyderabad, Rajahmundry, Bangalore"
      description="Visit our experience showrooms to test 7-zone organic latex & firm ortho mattresses. Get direct factory pricing, maps & directions."
      schema={storeSchemas}
    >
      <div className="relative overflow-hidden">
      <DecorativeBotanicals density="light" />
      <section className="section-light-lux py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FadeUp>
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Experience Before Buying
            </span>
            <h1 className="rp-display mt-5 text-ink-900">RelaxPro Mattress Partner to Showrooms</h1>
            <p className="rp-body mt-4">Walk in, test firmness profiles, lay down, and speak with Suresh&#39;s trained team directly at the locations below.</p>
          </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-sky-100/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayLocations.map((loc, idx) => (
            <motion.div key={idx} variants={staggerItem}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-brand-200 shadow-sm flex flex-col justify-between space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink-900 bg-brand-100 px-2.5 sm:px-3 py-1 rounded-md inline-block">{loc.city} Store</span>
                <p className="text-[13px] sm:text-sm text-graphite-700 leading-relaxed font-body">{loc.address}</p>
                {loc.hoursNote && (
                  <p className="text-[11px] sm:text-xs text-graphite-500 italic font-body leading-relaxed">{loc.hoursNote}</p>
                )}
                <div className="text-[12px] sm:text-xs space-y-2 border-t border-brand-200 pt-3 sm:pt-4 text-graphite-700 font-body">
                  <div><strong className="text-ink-900 font-semibold block uppercase text-[8px] sm:text-[9px] font-mono tracking-wider mb-0.5">Outlet hours</strong> {loc.hours || '10:00 AM - 9:00 PM Daily'}</div>
                  <div><strong className="text-ink-900 font-semibold block uppercase text-[8px] sm:text-[9px] font-mono tracking-wider mb-0.5">Contact</strong> <div className="font-mono text-[12px] sm:text-xs">{loc.phones?.join(' / ') || ''}</div></div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-brand-200 flex flex-col gap-2">
                <button
                  onClick={() => {
                    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi Suresh, I would like directions, phone triggers and appointment schedule for the RelaxPro ${loc.city} Mattress Outlet.`)}`, '_blank');
                  }}
                  className="w-full bg-ink-900 hover:bg-brand-800 text-white rounded-full py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer text-center"
                >
                  Book Visit
                </button>
                <a
                  href={buildMapsUrl(loc.coords, `${loc.address}, ${loc.city}, India`)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-ink-900 text-ink-900 hover:bg-brand-50 rounded-full py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer text-center block"
                >
                  Map Route
                </a>
              </div>
            </div>
            </motion.div>
          ))}
        </StaggerChildren>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
