import React, { useState, useEffect } from 'react';
import PageShell from '../../components/layout/PageShell';
import { getLocations } from '../../lib/queries';
import { LOCATIONS as FALLBACK_LOCATIONS } from '../../data/products';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [waNumber, setWaNumber] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || '918686624494');

  useEffect(() => {
    getLocations().then(data => {
      if (data && data.length > 0) setLocations(data);
    }).catch(() => {});
  }, []);

  const displayLocations = locations.length > 0 ? locations : FALLBACK_LOCATIONS;

  return (
    <PageShell
      title="RelaxPro Experience Stores - Hyderabad, Rajahmundry, Bangalore"
      description="Visit our experience showrooms to test 7-zone organic latex & firm ortho mattresses. Get direct factory pricing, maps & directions."
    >
      <div className="rp-container py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Showrooms
          </span>
          <h1 className="rp-display mt-5 text-primary">Visit our experience studios</h1>
          <p className="rp-body mt-4">Test firmness profiles, compare latex layers, and speak with the RelaxPro team before ordering.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayLocations.map((loc, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 border border-brand-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-brand-100 px-3 py-1 rounded-md inline-block">{loc.city} outlet</span>
                <p className="text-sm text-neutral-dark leading-relaxed font-body">{loc.address}</p>
                <div className="text-xs space-y-2 border-t border-brand-200 pt-4 text-neutral-dark font-body">
                  <div><strong className="text-primary font-semibold block uppercase text-[9px] font-mono tracking-wider mb-0.5">Open hours</strong> {loc.hours}</div>
                  <div><strong className="text-primary font-semibold block uppercase text-[9px] font-mono tracking-wider mb-0.5">Direct phone</strong> <div className="font-mono">{loc.phones?.join(' / ') || ''}</div></div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-200 flex flex-col gap-2">
                <button
                  onClick={() => {
                    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi Suresh, I would like directions, phone triggers and appointment schedule for the RelaxPro ${loc.city} Mattress Outlet.`)}`, '_blank');
                  }}
                  className="w-full bg-primary hover:bg-brand-800 text-white rounded-full py-3 text-xs font-bold uppercase tracking-wider cursor-pointer text-center"
                >
                  Book Visit Callback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
