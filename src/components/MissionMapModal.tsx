/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Peta Misi Nusantara (Level Selector Modal)
 * Peserta didik & Guru bebas melompat ke misi manapun tanpa syarat
 * Kurikulum Merdeka PAI Fase C (Kelas V & VI)
 */

import React from 'react';
import { LEVELS_CONFIG } from '../data/learningContent';
import { GradeLevel } from '../types';
import { sound } from '../audio/soundSystem';
import {
  Map,
  X,
  Play,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Home,
  School,
  Recycle,
  Mountain,
  Trees,
  Radio,
  ClipboardCheck,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface MissionMapModalProps {
  currentLevel: number;
  grade: GradeLevel;
  completedLevels: number[];
  onSelectLevel: (levelNum: number, showBriefing: boolean) => void;
  onOpenPostTest?: () => void;
  onOpenRealAction?: () => void;
  onClose: () => void;
}

export const MissionMapModal: React.FC<MissionMapModalProps> = ({
  currentLevel,
  grade,
  completedLevels,
  onSelectLevel,
  onOpenPostTest,
  onOpenRealAction,
  onClose,
}) => {
  const getLevelIcon = (lvlNum: number) => {
    switch (lvlNum) {
      case 1:
        return <Home className="w-5 h-5 text-emerald-400" />;
      case 2:
        return <School className="w-5 h-5 text-cyan-400" />;
      case 3:
        return <Recycle className="w-5 h-5 text-amber-400" />;
      case 4:
        return <Mountain className="w-5 h-5 text-purple-400" />;
      case 5:
        return <Trees className="w-5 h-5 text-green-400" />;
      case 6:
        return <Radio className="w-5 h-5 text-sky-400" />;
      default:
        return <Map className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleChooseLevel = (levelNum: number, showBriefing: boolean) => {
    sound.playInteract();
    onSelectLevel(levelNum, showBriefing);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NAVIGASI BEBAS KHALIFAH NUSANTARA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Map className="w-6 h-6 text-emerald-400" />
              <span>Peta Misi Penjaga Bumi</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Peserta didik dan Guru dapat melompat ke misi manapun secara bebas tanpa harus menyelesaikan misi sebelumnya.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            aria-label="Tutup Peta Misi"
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Level Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Freedom Badge Banner */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 sm:p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Semua 6 Misi dan Evaluasi <strong>terbuka 100%</strong>. Klik <strong>"Mulai Misi 3D"</strong> untuk langsung bermain, atau <strong>"Briefing Misi"</strong> untuk membaca arahan Robot BUMI.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEVELS_CONFIG.map((lvl) => {
              const isCurrent = currentLevel === lvl.levelNumber;
              const isCompleted = completedLevels.includes(lvl.levelNumber);
              const chapterRef = grade === '5' ? lvl.chapterRefV : lvl.chapterRefVI;
              const desc = grade === '5' ? lvl.descriptionV : lvl.descriptionVI;

              return (
                <div
                  key={lvl.levelNumber}
                  className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col justify-between gap-3 ${
                    isCurrent
                      ? 'bg-slate-950/90 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Level Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          {getLevelIcon(lvl.levelNumber)}
                        </div>
                        <span className="font-bold text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LEVEL {lvl.levelNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                            Aktif
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-black text-white text-base tracking-tight">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-emerald-300 font-medium line-clamp-1 mt-0.5">
                      {lvl.subtitle}
                    </p>

                    <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-500/20 px-2 py-1 rounded-lg mt-2 line-clamp-1">
                      {chapterRef}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChooseLevel(lvl.levelNumber, false)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Mulai Misi 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChooseLevel(lvl.levelNumber, true)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Lihat Dialog & Arahan Misi"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Briefing</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bonus Curriculum Stages (Post-Test & Aksi Nyata) */}
          <div className="pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tahap Evaluasi & Aksi Nyata Kurikulum Merdeka
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {onOpenPostTest && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playInteract();
                    onOpenPostTest();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        Post-Test Evaluasi PAI Fase C
                      </div>
                      <div className="text-[11px] text-slate-400">
                        10 Soal Berbasis AKM & Hikmah Qurani
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                </button>
              )}

              {onOpenRealAction && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playInteract();
                    onOpenRealAction();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        Proyek Aksi Nyata & Sertifikat
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Amalkan Nilai Khalifah di Sekolah/Rumah
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 pt-3 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">
            Dirancang untuk kemudahan pembelajaran di Interactive Flat Panel (IFP) Kelas & Komputer Siswa.
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playInteract();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700"
          >
            Tutup Peta Misi
          </button>
        </div>
      </div>
    </div>
  );
};
