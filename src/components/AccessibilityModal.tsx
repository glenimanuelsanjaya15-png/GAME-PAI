/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Accessibility & Display Settings Modal
 */

import React from 'react';
import { AccessibilitySettings } from '../types';
import { sound } from '../audio/soundSystem';
import { Settings, Volume2, Eye, Type, X } from 'lucide-react';

interface AccessibilityModalProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    sound.setVolume(val);
    onUpdateSettings({ ...settings, volume: val });
  };

  const toggleSubtitles = () => {
    sound.playInteract();
    onUpdateSettings({ ...settings, subtitles: !settings.subtitles });
  };

  const toggleHighContrast = () => {
    sound.playInteract();
    const nextVal = !settings.highContrast;
    document.body.classList.toggle('high-contrast', nextVal);
    onUpdateSettings({ ...settings, highContrast: nextVal });
  };

  const handleFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    sound.playInteract();
    document.body.classList.remove('font-large', 'font-xlarge');
    if (size === 'large') document.body.classList.add('font-large');
    if (size === 'xlarge') document.body.classList.add('font-xlarge');
    onUpdateSettings({ ...settings, fontSize: size });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Aksesibilitas & Pengaturan
            </h3>
            <p className="text-xs text-slate-400">Sesuaikan tampilan & audio untuk kenyamanan belajar</p>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              Volume Suara & Efek
            </span>
            <span className="font-mono text-emerald-400">{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={handleVolumeChange}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Subtitles Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Teks Dialog / Subtitle</div>
            <div className="text-[11px] text-slate-400">Cocok untuk bermain tanpa suara atau di kelas IFP</div>
          </div>
          <button
            type="button"
            onClick={toggleSubtitles}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              settings.subtitles ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Mode Kontras Tinggi</div>
            <div className="text-[11px] text-slate-400">Tingkatkan keterbacaan teks di proyektor</div>
          </div>
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
              settings.highContrast ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Type className="w-4 h-4 text-emerald-400" />
            Ukuran Font Huruf
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'xlarge'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleFontSize(sz)}
                className={`py-2 rounded-xl text-xs font-bold transition capitalize cursor-pointer border ${
                  settings.fontSize === sz
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sz === 'normal' ? 'Normal' : sz === 'large' ? 'Besar' : 'Sangat Besar'}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};
