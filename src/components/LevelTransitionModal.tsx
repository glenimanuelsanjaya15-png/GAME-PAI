/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cinematic Inter-Level Transition & Mission Briefing
 * Dialog dengan Robot BUMI & Tombol Lewati (Skip) Aman
 */

import React, { useState, useEffect } from 'react';
import { LevelInfo } from '../data/learningContent';
import { GradeLevel } from '../types';
import { sound } from '../audio/soundSystem';
import { Bot, ChevronRight, SkipForward, BookMarked, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface LevelTransitionModalProps {
  levelInfo: LevelInfo;
  grade: GradeLevel;
  onProceed: () => void;
}

export const LevelTransitionModal: React.FC<LevelTransitionModalProps> = ({
  levelInfo,
  grade,
  onProceed,
}) => {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(sound.isMuted || sound.isBgmMuted);

  useEffect(() => {
    // In transition between games (levels 2-6) or if opening music isn't active, play transition music
    if (levelInfo.levelNumber > 1 || !sound.isOpeningPlaying) {
      sound.playTransitionMusic();
    }
  }, [levelInfo.levelNumber]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sound.setBgmMute(nextMuted);
    setIsMuted(nextMuted);
  };

  const dialogs = levelInfo.cinematicDialog;
  const currentDialog = dialogs[dialogIndex] || dialogs[0];
  const isLastDialog = dialogIndex >= dialogs.length - 1;

  const handleNextDialog = () => {
    sound.playTextBeep();
    if (isLastDialog) {
      sound.playSuccess();
      sound.stopTransitionMusic();
      onProceed();
    } else {
      setDialogIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    sound.playInteract();
    sound.stopTransitionMusic();
    onProceed();
  };

  const chapterRef = grade === '5' ? levelInfo.chapterRefV : levelInfo.chapterRefVI;
  const description = grade === '5' ? levelInfo.descriptionV : levelInfo.descriptionVI;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in relative">
        {/* Controls (Top-Right): Audio Toggle & Skip Button */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
            className="p-2 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
          >
            <span>Lewati</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Level Tag & Curriculum Reference */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MENUJU LEVEL {levelInfo.levelNumber}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
            {levelInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
            {levelInfo.subtitle}
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
            <BookMarked className="w-3.5 h-3.5 shrink-0" />
            <span>{chapterRef}</span>
          </div>
        </div>

        {/* Mission Briefing */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <span className="font-bold text-white">Panduan Misi: </span>
          {description}
        </div>

        {/* Dialogue Box with Robot BUMI */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shrink-0 shadow-lg border border-emerald-300">
            <Bot className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center justify-between">
              <span>{currentDialog.speaker}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {dialogIndex + 1} / {dialogs.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed italic">
              "{currentDialog.text}"
            </p>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1.5">
            {dialogs.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === dialogIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextDialog}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-xs sm:text-sm transition cursor-pointer"
          >
            <span>{isLastDialog ? 'Mulai Level Sekarang' : 'Lanjut Dialog'}</span>
            <ChevronRight className="w-4 h-4 font-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
