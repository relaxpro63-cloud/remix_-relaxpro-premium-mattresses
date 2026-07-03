import React from 'react';
import PageShell from '../../components/layout/PageShell';
import { LOCATIONS } from '../../data/products';

export default function LocationsPage() {
  return (
    <PageShell
      title="RelaxPro Experience Stores - Hyderabad, Rajahmundry, Bangalore"
      description="Visit our experience showrooms to test 7-zone organic latex & firm ortho mattresses. Get direct factory pricing, maps & directions."
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="max-w-2xl mb-12">
          <span className="text-xs tracking-widest font-mono text-brand-600 uppercase bg-brand-100 px-3 py-1 rounded-full font-bold">GET METROPOLITAN ADDRESSES & DIRECTIONS</span>
          <h1 className="text-4xl font-display font-medium tracking-tight mt-4 text-brand-950">Visit Our Experience Studios</h1>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">Test the mattresses yourself before ordering. Speak with support teams who compile orthopedic statistics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {LOCATIONS.map((loc, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/60 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-display font-bold uppercase tracking-widest text-brand-800 bg-brand-100 px-3 py-1 rounded-md inline-block">{loc.city} outlet</span>
                <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium">{loc.address}</p>
                <div className="text-xs space-y-2 border-t border-zinc-100 pt-4 text-zinc-650 font-sans">
                  <div><strong className="text-zinc-900 font-semibold block uppercase text-[9px] font-mono tracking-wider mb-0.5">OPEN HOURS:</strong> {loc.hours}</div>
                  <div><strong className="text-zinc-900 font-semibold block uppercase text-[9px] font-mono tracking-wider mb-0.5">DIRECT PHONE:</strong> <div className="font-mono">{loc.phones.join(' / ')}</div></div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    window.open(`https://wa.me/918686624494?text=${encodeURIComponent(`Hi Suresh, I would like directions, phone triggers and appointment schedule for the RelaxPro ${loc.city} Mattress Outlet.`)}`, '_blank');
                  }}
                  className="w-full bg-brand-950 hover:bg-brand-800 text-white rounded-lg py-2.5 text-xs font-semibold uppercase font-display tracking-wider cursor-pointer text-center"
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
