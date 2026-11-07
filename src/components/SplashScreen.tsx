/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Splash Screen & Profil Khalifah Siswa
 * Identitas Pengembang Permanen:
 * - Nama: Bachtiar Imani, S.Pd.
 * - Instansi: SDN 2 Girimarto, Kabupaten Wonogiri, Jawa Tengah
 * - NPA PGRI: 33122211124
 * - Logo: PGRI & Pemkab Wonogiri
 */

import React, { useState, useEffect } from 'react';
import { GradeLevel, AvatarId, StudentProfile } from '../types';
import { sound } from '../audio/soundSystem';
import { Sparkles, Shield, User, Award, Volume2, VolumeX, BookOpen, Compass, ChevronRight, Music, Map } from 'lucide-react';

interface SplashScreenProps {
  onStartGame: (profile: StudentProfile) => void;
  onOpenMissionMap?: () => void;
  savedProfile: StudentProfile | null;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame, onOpenMissionMap, savedProfile }) => {
  const [name, setName] = useState(savedProfile?.name || 'Ahmad Rayyan');
  const [grade, setGrade] = useState<GradeLevel>(savedProfile?.grade || '5');
  const [avatar, setAvatar] = useState<AvatarId>(savedProfile?.avatar || 'rayyan');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Attempt to play opening music on first user interaction if allowed
  useEffect(() => {
    const handleFirstTouch = () => {
      if (!sound.isOpeningPlaying) {
        const played = sound.playOpeningMusic();
        if (played) {
          setIsMusicPlaying(true);
        }
      }
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('keydown', handleFirstTouch, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const active = sound.toggleOpeningMusic();
    setIsMusicPlaying(active);
  };

  const handleStart = () => {
    // Opening music continues playing through briefing until user clicks "Mulai Level Sekarang"
    if (!sound.isOpeningPlaying) {
      sound.playOpeningMusic();
    }
    sound.playSuccess();
    const finalProfile: StudentProfile = {
      name: name.trim() || 'Khalifah Cilik',
      grade,
      avatar,
      highScore: savedProfile?.highScore || 0,
      totalScore: savedProfile?.totalScore || 0,
      xp: savedProfile?.xp || 0,
      ecoCoins: savedProfile?.ecoCoins || 10,
      currentLevel: savedProfile?.currentLevel || 1,
      completedLevels: savedProfile?.completedLevels || [],
      lastPlayed: new Date().toISOString(),
    };
    onStartGame(finalProfile);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/80 to-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
      {/* Background Islamic / Eco Geometric Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* HEADER: Permanent Identity & Official Logos */}
      <header className="w-full max-w-4xl bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-md shadow-2xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Logo Pemkab Wonogiri */}
          <div className="relative group bg-white/95 p-1.5 rounded-xl shadow-md border border-emerald-400/40 hover:scale-105 transition-transform flex items-center justify-center">
            <img
              src="https://i.imgur.com/RVQBxN6.png"
              alt="Logo Resmi Pemkab Wonogiri"
              className="w-12 h-14 object-contain"
              onError={(e) => {
                // Fallback in case of CORS or connection
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          {/* Logo Resmi PGRI */}
          <div className="relative group bg-white/95 p-1.5 rounded-xl shadow-md border border-red-400/40 hover:scale-105 transition-transform flex items-center justify-center">
            <img
              src="https://i.imgur.com/5isghy7.png"
              alt="Logo Resmi PGRI"
              className="w-12 h-14 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" /> Media Edukasi Resmi PAI Fase C
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
              Bachtiar Imani, S.Pd.
            </h2>
            <p className="text-xs text-emerald-300/90 font-medium">
              SDN 2 Girimarto, Kabupaten Wonogiri, Jawa Tengah
            </p>
            <p className="text-[11px] text-slate-400">
              NPA PGRI: <span className="text-amber-400 font-mono font-semibold">33122211124</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMusic}
            className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition shadow-sm cursor-pointer ${
              isMusicPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
            title="Nyalakan atau matikan musik opening"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="flex items-center gap-1">
                  Musik Opening: <span className="text-emerald-400 font-bold">Aktif 🎵</span>
                </span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4 text-slate-400" />
                <span>Putar Musik Opening 🎵</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-emerald-950/60 border border-emerald-500/20 px-3 py-2 rounded-xl text-emerald-200">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kurikulum Merdeka: Tauhid Ekologis</span>
          </div>
        </div>
      </header>

      {/* MAIN BANNER & CONFIGURATION */}
      <main className="w-full max-w-4xl my-auto py-6 relative z-10 flex flex-col items-center text-center">
        {/* Title Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" /> Petualangan 3D Khalifah Cilik Nusantara
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 drop-shadow-sm font-['Outfit']">
          PENJAGA BUMI NUSANTARA
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 mb-6">
          Wujudkan amanah agung sebagai <span className="text-emerald-400 font-bold">Khalifah fil Ardh</span>. Rawat rumah, sekolah, dan bumi Nusantara dengan ilmu, kepedulian ekologis, dan tabayyun.
        </p>

        {/* PROFILE SETUP CARD */}
        <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left space-y-6">
          {/* Input Nama Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Nama Lengkap Siswa / Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama siswa..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
            />
          </div>

          {/* Pemilihan Jenjang Kelas (Data-Driven Learning Path) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Pilih Jenjang Kelas (Kurikulum Merdeka Fase C)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kelas V */}
              <button
                type="button"
                onClick={() => {
                  setGrade('5');
                  sound.playInteract();
                }}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  grade === '5'
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-emerald-400">KELAS V (LIMA)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">Fondasi Tauhid</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fokus: Tauhid ekologis, makna manusia sebagai Khalifah, tugas menjaga kebersihan di rumah, sekolah, dan adab alam.
                  </p>
                </div>
              </button>

              {/* Kelas VI */}
              <button
                type="button"
                onClick={() => {
                  setGrade('6');
                  sound.playInteract();
                }}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  grade === '6'
                    ? 'bg-teal-950/80 border-teal-400 ring-2 ring-teal-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-teal-400">KELAS VI (ENAM)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold">Analisis Lanjutan</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fokus: Analisis ekosistem biotik-abiotik, material daur ulang ilmiah, QS. Ar-Rum: 41, serta verifikasi berita (Tabayyun).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Pemilihan Avatar Karakter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" /> Pilih Karakter Khalifah
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAvatar('rayyan');
                  sound.playInteract();
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  avatar === 'rayyan'
                    ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700 text-lg">
                  👳
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Rayyan</div>
                  <div className="text-[11px] text-slate-400">Peci & Seragam Pramuka</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvatar('aisyah');
                  sound.playInteract();
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  avatar === 'aisyah'
                    ? 'bg-teal-950/70 border-teal-400 ring-2 ring-teal-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-teal-400 border border-slate-700 text-lg">
                  🧕
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Aisyah</div>
                  <div className="text-[11px] text-slate-400">Hijab Hijau Penjaga Bumi</div>
                </div>
              </button>
            </div>
          </div>

          {/* Tombol Mulai Petualangan */}
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 text-base sm:text-lg transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span>Mulai Petualangan Menjaga Bumi</span>
            <ChevronRight className="w-5 h-5 text-slate-950 font-black" />
          </button>

          {/* Tombol Peta Misi (Bebas Lompat Level) */}
          {onOpenMissionMap && (
            <button
              type="button"
              onClick={() => {
                sound.playInteract();
                onOpenMissionMap();
              }}
              className="w-full py-3 px-5 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition cursor-pointer shadow-md"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>Peta Misi (Lompat Bebas ke Level 1 - 6)</span>
            </button>
          )}
        </div>
      </main>

      {/* FOOTER: Educational Ethics & Device Accessibility */}
      <footer className="w-full max-w-4xl text-center py-2 text-xs text-slate-400 border-t border-slate-800/60 mt-4 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2024 SDN 2 Girimarto Wonogiri — PAI Fase C Kurikulum Merdeka</span>
        <span className="text-[11px] text-slate-500">
          Mendukung Komputer Desktop (WASD/Mouse) & Layar Sentuh Mobile / IFP Kelas
        </span>
      </footer>
    </div>
  );
};
