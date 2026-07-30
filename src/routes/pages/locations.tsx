import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import PageShell from '../../components/layout/PageShell';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
import { getLocations } from '../../lib/queries';
import { LOCATIONS as FALLBACK_LOCATIONS } from '../../data/products';
import { WHATSAPP_NUMBER } from '../../lib/site';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [waNumber, setWaNumber] = useState(WHATSAPP_NUMBER);

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
          };
        });
        setLocations(normalized);
      }
    }).catch(() => {});
  }, []);

  const displayLocations = locations.length > 0 ? locations : FALLBACK_LOCATIONS;

  return (
    <PageShell
      title="RelaxPro Experience Stores - Hyderabad, Rajahmundry, Bangalore"
      description="Visit our experience showrooms to test 7-zone organic latex & firm ortho mattresses. Get direct factory pricing, maps & directions."
    >
      <div className="relative overflow-hidden">
      <DecorativeBotanicals density="light" />
      <section className="bg-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FadeUp>
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Experience Before Buying
            </span>
            <h1 className="rp-display mt-5 text-ink-900">Our Showrooms and Manufacturer Outlets</h1>
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
                  Book Visit + Map Route
                </button>
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
