/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Tas Pemulihan (Inventory Pelestarian Bumi)
 */

import React from 'react';
import { InventoryItem } from '../types';
import { Backpack, Sparkles, X, ShieldAlert, Leaf, Recycle, Wrench } from 'lucide-react';

interface InventoryModalProps {
  items: InventoryItem[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ items, onClose }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organik':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'anorganik':
        return <Recycle className="w-4 h-4 text-cyan-400" />;
      case 'b3':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Wrench className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Backpack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Tas Pemulihan Khalifah
            </h3>
            <p className="text-xs text-slate-400">
              Koleksi material, alat pengaman, dan bukti pemilahan lingkungan
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Tas Pemulihan masih kosong. Dekati benda di sekitarmu dan tekan <span className="text-emerald-400 font-bold">[E]</span> untuk memilah.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {getCategoryIcon(it.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{it.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{it.description}</div>
                  <div className="text-[10px] text-amber-400 font-bold mt-1">
                    Jumlah: {it.count}x
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
        >
          Tutup Tas
        </button>
      </div>
    </div>
  );
};
