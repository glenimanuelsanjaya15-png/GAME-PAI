/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proyek Aksi Nyata (Kurikulum Merdeka PAI Fase C)
 * Kelas V: Kartu Janji Khalifah Cilik
 * Kelas VI: Rencana Aksi Ekologis & Kampanye Tabayyun
 */

import React, { useState } from 'react';
import { GradeLevel, StudentProfile } from '../types';
import { REAL_ACTION_PROJECT_TEMPLATES } from '../data/learningContent';
import { sound } from '../audio/soundSystem';
import {
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Printer,
  Copy,
  ArrowRight,
  HeartHandshake,
  Check,
} from 'lucide-react';

interface RealActionProjectModalProps {
  profile: StudentProfile;
  onProceedToCertificate: () => void;
}

export const RealActionProjectModal: React.FC<RealActionProjectModalProps> = ({
  profile,
  onProceedToCertificate,
}) => {
  const isGrade5 = profile.grade === '5';
  const data5 = REAL_ACTION_PROJECT_TEMPLATES['5'];
  const data6 = REAL_ACTION_PROJECT_TEMPLATES['6'];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: false,
    c5: false,
  });

  const [customActionPlan, setCustomActionPlan] = useState({
    problem: 'Timbulan sampah plastik sachet di kantin sekolah SDN 2 Girimarto.',
    solution3R: 'Membawa kotak makan sendiri dan membuat pojok pilah sampah botol plastik untuk upcycling pot toga.',
    campaignSlogan: '"Tabayyun Dulu Baru Sebar: Cerdas Berita, Rawat Bumi Girimarto!"',
  });

  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    sound.playInteract();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyText = () => {
    sound.playSuccess();
    const textToCopy = isGrade5
      ? `=== ${data5.title} ===\nNama Siswa: ${profile.name} (Kelas V)\nPengembang: Bachtiar Imani, S.Pd. - SDN 2 Girimarto Wonogiri\n\nKomitmen Nyata:\n${data5.commitments.map((c, i) => `${i + 1}. ${c.text}`).join('\n')}`
      : `=== ${data6.title} ===\nNama Siswa: ${profile.name} (Kelas VI)\nPengembang: Bachtiar Imani, S.Pd. - SDN 2 Girimarto Wonogiri\n\n1. Masalah: ${customActionPlan.problem}\n2. Solusi 3R: ${customActionPlan.solution3R}\n3. Slogan Kampanye: ${customActionPlan.campaignSlogan}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.playInteract();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-auto text-left relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                Portofolio Proyek Profil Pelajar Pancasila & Rahmatan Lil 'Alamin
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {isGrade5 ? data5.title : data6.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Salin Teks Proyek"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Cetak Dokumen"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Content based on Grade */}
        {isGrade5 ? (
          /* KELAS V: KARTU JANJI KHALIFAH CILIK */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300">
              Sebagai Khalifah cilik yang beriman kepada Allah SWT, centanglah komitmen nyata yang berjanji akan kamu laksanakan secara konsisten di rumah dan SDN 2 Girimarto:
            </p>

            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              {data5.commitments.map((c, idx) => {
                const isChecked = !!checkedItems[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCheck(c.id)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'text-white font-medium' : 'text-slate-400'}`}>
                      {idx + 1}. {c.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-200 italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                "Amanah yang kamu jalankan dengan ikhlas di bumi akan menjadi saksi kebaikan di akhirat kelak."
              </span>
            </div>
          </div>
        ) : (
          /* KELAS VI: RENCANA AKSI EKOLOGIS & KAMPANYE TABAYYUN */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300">
              Rancang rencana aksi nyata dan slogan kampanye lingkungan sekolah SDN 2 Girimarto berbasis nalar kritis Tabayyun:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <label className="block text-xs font-bold text-amber-400">
                  1. Masalah Biotik & Abiotik yang Ditemukan di Sekolah:
                </label>
                <input
                  type="text"
                  value={customActionPlan.problem}
                  onChange={(e) => setCustomActionPlan({ ...customActionPlan, problem: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <label className="block text-xs font-bold text-emerald-400">
                  2. Solusi 3R Terpadu (Reduce, Reuse, Recycle):
                </label>
                <textarea
                  value={customActionPlan.solution3R}
                  onChange={(e) => setCustomActionPlan({ ...customActionPlan, solution3R: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <label className="block text-xs font-bold text-sky-400">
                  3. Slogan Poster Kampanye Literasi & Tabayyun:
                </label>
                <input
                  type="text"
                  value={customActionPlan.campaignSlogan}
                  onChange={(e) => setCustomActionPlan({ ...customActionPlan, campaignSlogan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data6.sloganIdeas.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomActionPlan({ ...customActionPlan, campaignSlogan: s })}
                      className="text-[10px] text-slate-400 hover:text-sky-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full cursor-pointer transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            sound.playSuccess();
            onProceedToCertificate();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base transition cursor-pointer shadow-xl flex items-center justify-center gap-2"
        >
          <span>Terbitkan Sertifikat Penghargaan Resmi</span>
          <ArrowRight className="w-4 h-4 font-black" />
        </button>
      </div>
    </div>
  );
};
