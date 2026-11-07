/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pause & Panduan Kurikulum Merdeka PAI Fase C
 */

import React from 'react';
import { GradeLevel } from '../types';
import { Play, RotateCcw, BookOpen, Compass, Shield, X, Sparkles, Map } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface PauseHelpModalProps {
  grade: GradeLevel;
  currentLevel: number;
  onResume: () => void;
  onRestartLevel: () => void;
  onOpenMissionMap?: () => void;
}

export const PauseHelpModal: React.FC<PauseHelpModalProps> = ({
  grade,
  currentLevel,
  onResume,
  onRestartLevel,
  onOpenMissionMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative animate-fade-in my-auto">
        <button
          type="button"
          onClick={onResume}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Permainan Dijeda (Pause)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Panduan Kontrol & Kurikulum Merdeka PAI Fase C
            </h2>
          </div>
        </div>

        {/* Dual Control Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Kontrol Komputer / Laptop:
            </div>
            <ul className="text-slate-300 space-y-1 pl-1 leading-relaxed">
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">W A S D</kbd> / Panah: Bergerak</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">Spasi</kbd>: Melompat</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">E</kbd>: Berinteraksi / Ambil Benda</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">Klik Drag Mouse</kbd>: Putar Kamera TPP 360°</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">Scroll Mouse</kbd>: Zoom In / Zoom Out</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Layar Sentuh / Tablet / IFP Kelas:
            </div>
            <ul className="text-slate-300 space-y-1 pl-1 leading-relaxed">
              <li><span className="font-semibold text-white">Joystick Virtual (Kiri Bawah)</span>: Gerakkan karakter</li>
              <li><span className="font-semibold text-white">Tombol [E] (Kanan Bawah)</span>: Interaksi & Aksi</li>
              <li><span className="font-semibold text-white">Tombol [▲] (Kanan Bawah)</span>: Lompat</li>
              <li><span className="font-semibold text-white">Sentuh & Tarik Layar</span>: Arahkan sudut pandang</li>
            </ul>
          </div>
        </div>

        {/* Alur Capaian Pembelajaran (ATP) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            Capaian Pembelajaran (CP) PAI Fase C — Kelas {grade}:
          </div>
          <p className="text-slate-300 leading-relaxed">
            {grade === '5'
              ? 'Peserta didik memahami peran manusia sebagai khalifah di bumi (QS. Al-Baqarah: 30), membiasakan adab hidup bersih, memilah sampah, dan tidak berbuat mubazir di rumah dan sekolah.'
              : 'Peserta didik menganalisis fenomena kerusakan bumi (QS. Ar-Rum: 41), dampak limbah terhadap faktor biotik-abiotik, menerapkan prinsip sirkular 3R, serta membiasakan sikap kritis verifikasi berita (Tabayyun - QS. Al-Hujurat: 6).'}
          </p>
        </div>

        {/* Identitas Pengembang */}
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Bachtiar Imani, S.Pd.</div>
            <div className="text-[11px] text-emerald-300/80">SDN 2 Girimarto Wonogiri • NPA PGRI: 33122211124</div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
            PAI Kurikulum Merdeka
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onResume}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Play className="w-4 h-4 font-black" />
            <span>Lanjutkan Permainan</span>
          </button>

          {onOpenMissionMap && (
            <button
              type="button"
              onClick={onOpenMissionMap}
              className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Map className="w-4 h-4 text-amber-300" />
              <span>Peta Misi</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestartLevel}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
