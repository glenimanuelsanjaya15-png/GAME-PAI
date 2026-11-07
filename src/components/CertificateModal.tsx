/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sertifikat Penghargaan Resmi Khalifah Penjaga Bumi Nusantara
 * Dilengkapi Identitas Pengembang, Tanda Tangan, Logo Resmi PGRI & Wonogiri,
 * dan Catatan Etis Pedagogis Kurikulum Merdeka.
 */

import React, { useEffect } from 'react';
import { StudentProfile } from '../types';
import { sound } from '../audio/soundSystem';
import {
  Award,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  profile: StudentProfile;
  finalScore: number;
  onRestart: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  profile,
  finalScore,
  onRestart,
}) => {
  useEffect(() => {
    sound.playLevelFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  const certificateNumber = `PBN-SDN2GRM-${profile.grade}-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playInteract();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 my-auto text-left relative">
        {/* ACTION BUTTONS (TOP) */}
        <div className="flex items-center justify-between no-print border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Dokumen Penghargaan Capaian Pembelajaran</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mulai Petualangan Baru</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CONTAINER */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-8 border-double border-emerald-900 rounded-3xl p-6 sm:p-10 text-slate-900 shadow-2xl relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Subtle Decorative Background Seal */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* CERTIFICATE HEADER: LOGOS & SCHOOL */}
          <div className="flex items-center justify-between border-b-2 border-emerald-800/40 pb-4 mb-6">
            {/* Logo Pemkab Wonogiri */}
            <div className="w-16 h-20 flex items-center justify-center">
              <img
                src="https://i.imgur.com/RVQBxN6.png"
                alt="Logo Pemkab Wonogiri"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Title & Official Details */}
            <div className="text-center flex-1 px-4">
              <h3 className="text-xs sm:text-sm font-extrabold text-emerald-950 uppercase tracking-widest">
                PEMERINTAH KABUPATEN WONOGIRI — DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h3>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                SD NEGERI 2 GIRIMARTO, KECAMATAN GIRIMARTO
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                Pendidikan Agama Islam dan Budi Pekerti (Fase C Kurikulum Merdeka)
              </p>
            </div>

            {/* Logo Resmi PGRI */}
            <div className="w-16 h-20 flex items-center justify-center">
              <img
                src="https://i.imgur.com/5isghy7.png"
                alt="Logo PGRI"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* MAIN CERTIFICATE TITLE */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight font-['Outfit']">
              SERTIFIKAT PENGHARGAAN
            </h1>
            <div className="text-xs font-bold text-amber-800 tracking-wider">
              NOMOR SERI RESMI: <span className="font-mono text-emerald-900">{certificateNumber}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic pt-1">
              Diberikan dengan rasa syukur dan bangga kepada:
            </p>
          </div>

          {/* STUDENT NAME */}
          <div className="text-center my-4">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-900 border-b-2 border-emerald-700 pb-2 inline-block px-8 tracking-tight font-serif">
              {profile.name}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-2">
              Siswa Kelas {profile.grade === '5' ? 'V (Lima)' : 'VI (Enam)'} — SDN 2 Girimarto Wonogiri
            </div>
          </div>

          {/* CITATION & ACHIEVEMENT */}
          <div className="text-center text-xs sm:text-sm text-slate-800 max-w-2xl mx-auto leading-relaxed space-y-2 mb-6">
            <p>
              Telah berhasil menyelesaikan seluruh 6 Tingkat Petualangan Edukasi 3D{' '}
              <span className="font-bold text-emerald-900">"PENJAGA BUMI NUSANTARA"</span> dengan capaian{' '}
              <span className="font-bold text-emerald-900">KHALIFAH UTAMA PELESTARI LINGKUNGAN</span>,
              menguasai Tauhid Ekologis, Pemilahan Sampah 3R, Keseimbangan Sunnatullah, dan Literasi Tabayyun.
            </p>

            <div className="inline-flex items-center gap-4 bg-emerald-100/80 border border-emerald-300 px-4 py-2 rounded-2xl text-xs font-bold text-emerald-950">
              <span>Nilai Evaluasi: <span className="text-emerald-800 font-mono text-sm">{finalScore}/100</span></span>
              <span>•</span>
              <span>Koin Kebaikan: <span className="text-amber-800 font-mono text-sm">{profile.ecoCoins}</span></span>
              <span>•</span>
              <span>Total XP: <span className="text-teal-800 font-mono text-sm">{profile.xp}</span></span>
            </div>
          </div>

          {/* SIGNATURE & LEGAL IDENTITIES */}
          <div className="flex flex-row items-end justify-between pt-6 border-t border-slate-300 text-xs">
            <div className="text-left space-y-1">
              <div className="text-[11px] text-slate-500">Mengesahkan,</div>
              <div className="font-bold text-slate-800">Kepala Sekolah SDN 2 Girimarto</div>
              <div className="h-12 flex items-center">
                <span className="text-[10px] text-slate-400 italic">[Tertanda Digital]</span>
              </div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">
                Dinas Pendidikan Kab. Wonogiri
              </div>
            </div>

            {/* Official Seal Badge */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-800 bg-emerald-50 flex flex-col items-center justify-center text-emerald-900 shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-800" />
                <span className="text-[8px] font-black uppercase tracking-tighter">TERVERIFIKASI</span>
              </div>
            </div>

            {/* Guru PAI & Pengembang */}
            <div className="text-right space-y-1">
              <div className="text-[11px] text-slate-600">Wonogiri, {currentDate}</div>
              <div className="font-bold text-slate-800">Guru PAI & Pengembang Game,</div>
              <div className="h-12 flex items-center justify-end">
                <div className="font-serif italic text-emerald-900 font-bold text-sm tracking-wide">
                  Bachtiar Imani, S.Pd.
                </div>
              </div>
              <div className="font-extrabold text-slate-900 border-t border-slate-400 pt-1">
                Bachtiar Imani, S.Pd.
              </div>
              <div className="text-[11px] text-slate-600">
                NPA PGRI: <span className="font-mono font-bold text-emerald-950">33122211124</span>
              </div>
            </div>
          </div>

          {/* MANDATORY ETHICAL PEDAGOGICAL DISCLAIMER */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-tight text-center italic">
            <span className="font-bold not-italic text-slate-700">Catatan Etis & Pedagogis: </span>
            Skor game ini mengukur pemahaman kognitif dan literasi nilai dalam lingkungan simulasi edukatif, bukan merupakan klaim mutlak terhadap perubahan kepribadian dan karakter di dunia nyata. Nilai sejati seorang Khalifah tercermin pada konsistensi akhlak nyata merawat bumi dan sesama makhluk hidup sehari-hari.
          </div>
        </div>
      </div>
    </div>
  );
};
