/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Radar Investigasi Khalifah Nusantara (Level 6)
 * Berita Resmi, Verifikasi Tabayyun, & Analisis Historis vs Terkini
 */

import React, { useState } from 'react';
import { RadarHotspot } from '../types';
import { sound } from '../audio/soundSystem';
import {
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Compass,
  X,
  History,
  Sparkles,
} from 'lucide-react';

interface RadarInvestigasiModalProps {
  hotspots: RadarHotspot[];
  selectedHotspotId?: string;
  onVerifyHotspot: (hotspotId: string) => void;
  onClose: () => void;
}

export const RadarInvestigasiModal: React.FC<RadarInvestigasiModalProps> = ({
  hotspots,
  selectedHotspotId,
  onVerifyHotspot,
  onClose,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedHotspotId || hotspots[0]?.id || 'wonogiri');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [verifiedState, setVerifiedState] = useState<Record<string, boolean>>({});

  const activeHotspot = hotspots.find((h) => h.id === activeId) || hotspots[0];
  const isVerified = verifiedState[activeId] || activeHotspot.verified;

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (idx === activeHotspot.correctOptionIndex) {
      sound.playSuccess();
      setVerifiedState((prev) => ({ ...prev, [activeId]: true }));
      onVerifyHotspot(activeId);
    } else {
      sound.playSoftBlip();
    }
  };

  const verifiedCount = hotspots.filter((h) => verifiedState[h.id] || h.verified).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-sky-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 my-auto text-left relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Verification Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Ruang Kendali Hologram Radar Nusantara
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Investigasi Tabayyun & Verifikasi Berita Lingkungan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-2xl self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">
              Terverifikasi:{' '}
              <span className="text-emerald-400 font-bold font-mono">
                {verifiedCount} / {hotspots.length} Titik
              </span>
            </span>
          </div>
        </div>

        {/* Hotspots Selector Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {hotspots.map((h) => {
            const isCurr = h.id === activeId;
            const isHotspotDone = verifiedState[h.id] || h.verified;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  setActiveId(h.id);
                  setSelectedOption(null);
                  sound.playInteract();
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isCurr
                    ? 'bg-sky-950/80 border-sky-400 text-sky-300 ring-2 ring-sky-400/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isHotspotDone ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                )}
                <span>{h.locationName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Hotspot Investigation Detail Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 border-b border-slate-900 pb-3">
            <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {activeHotspot.locationName}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {activeHotspot.publisher}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {activeHotspot.publishDate}
            </span>
          </div>

          {/* Title & Official Link */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
              {activeHotspot.title}
            </h3>
            <a
              href={activeHotspot.realUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 hover:underline font-semibold bg-sky-950/40 border border-sky-500/20 px-3 py-1.5 rounded-xl transition"
            >
              <span>Kunjungi Tautan Berita Resmi Lembaga Kredibel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Ringkasan & Solusi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Isu Lingkungan Nyata:
              </div>
              <div className="text-slate-300 leading-relaxed">
                {activeHotspot.environmentalIssue}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Solusi Berkelanjutan & Fakta:
              </div>
              <div className="text-slate-300 leading-relaxed">
                {activeHotspot.solutionAndFact}
              </div>
            </div>
          </div>

          {/* Historis vs Kondisi Terkini */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs flex items-start gap-3">
            <History className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <span className="font-bold text-purple-300">Pembeda Waktu (Historis vs Terkini): </span>
              {activeHotspot.historicalVsCurrent}
            </div>
          </div>

          {/* Uji Tabayyun Interaktif */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-sky-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Pertanyaan Verifikasi Tabayyun:
            </div>
            <p className="text-xs text-white font-medium">
              {activeHotspot.tabayyunQuestion}
            </p>

            <div className="space-y-2">
              {activeHotspot.tabayyunOptions.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === activeHotspot.correctOptionIndex;
                let optClass = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-950/80 border-rose-400 text-rose-200';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={isVerified}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 cursor-pointer ${optClass}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {isVerified && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Alhamdulillah! Data titik ini telah berhasil Anda tabayyun dan verifikasi secara objektif.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Pastikan seluruh 6 stasiun radar telah terverifikasi sebelum evaluasi akhir.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Tutup Ruang Radar
          </button>
        </div>
      </div>
    </div>
  );
};
