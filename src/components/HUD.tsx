/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ergonomic In-Game HUD (Zero Viewport Occlusion)
 * Objective tracker, health, eco-coins, timer, proximity prompt, collapsible action dock
 */

import React, { useState } from 'react';
import { StudentProfile, LevelObjective, ToastMessage, InteractiveObjectInfo, InventoryItem } from '../types';
import {
  Heart,
  Coins,
  Sparkles,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Eye,
  Pause,
  ChevronDown,
  ChevronUp,
  Backpack,
  CheckCircle2,
  Settings,
  HelpCircle,
  Map,
} from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface HUDProps {
  profile: StudentProfile;
  currentLevel: number;
  levelTitle: string;
  objectives: LevelObjective[];
  health: number; // 0 to 100
  score: number;
  ecoCoins: number;
  timerSeconds: number;
  bonusTimerAnimation: boolean;
  proximityPrompt: InteractiveObjectInfo | null;
  activeToast: ToastMessage | null;
  subtitlesEnabled: boolean;
  currentSubtitle: string | null;
  inventory: InventoryItem[];
  onOpenInventory: () => void;
  onOpenAccessibility: () => void;
  onOpenPause: () => void;
  onOpenMissionMap: () => void;
  onTriggerInteraction: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  profile,
  currentLevel,
  levelTitle,
  objectives,
  health,
  score,
  ecoCoins,
  timerSeconds,
  bonusTimerAnimation,
  proximityPrompt,
  activeToast,
  subtitlesEnabled,
  currentSubtitle,
  inventory,
  onOpenInventory,
  onOpenAccessibility,
  onOpenPause,
  onOpenMissionMap,
  onTriggerInteraction,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMute(next);
    sound.setBgmMute(next);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ======================================================== */}
      {/* TOP-LEFT: Objective Tracker & Level Info */}
      {/* ======================================================== */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 pointer-events-auto max-w-[280px] sm:max-w-sm">
        <div className="bg-slate-950/85 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-xl">
          {/* Level Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                LEVEL {currentLevel}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Kelas {profile.grade}
              </span>
            </div>
            {/* Tombol Peta Misi */}
            <button
              type="button"
              onClick={onOpenMissionMap}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md border border-emerald-400/50 transition active:scale-95 cursor-pointer shrink-0"
              title="Buka Peta Misi: Bebas Lompat ke Level Manapun"
            >
              <Map className="w-3.5 h-3.5 text-amber-300" />
              <span>Peta Misi</span>
            </button>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-2 truncate">
            {levelTitle}
          </h3>

          {/* Objectives List */}
          <div className="space-y-1.5">
            {objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-2 text-xs">
                <CheckCircle2
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    obj.completed ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`leading-tight ${
                      obj.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}
                  >
                    {obj.text}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {obj.current} / {obj.required}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TOP-CENTER: Toast Notification / Qur'an Wisdom Banner */}
      {/* ======================================================== */}
      {activeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto max-w-md w-[92vw] sm:w-auto animate-bounce-in">
          <div
            className={`px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 text-left ${
              activeToast.type === 'khalifah'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : activeToast.type === 'success'
                ? 'bg-teal-950/95 border-teal-500/50 text-teal-200'
                : 'bg-slate-900/95 border-amber-500/50 text-amber-200'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{activeToast.title}</div>
              <div className="text-[11px] leading-tight text-slate-300">{activeToast.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP-RIGHT: Health, Score, Eco-Coins & Relaxed Timer */}
      {/* ======================================================== */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 pointer-events-auto flex flex-col items-end gap-2">
        {/* Stats Card */}
        <div className="bg-slate-950/85 border border-slate-800 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md shadow-xl flex items-center gap-3 sm:gap-4">
          {/* Health Bar (Eco-Vitality) */}
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            <div className="w-16 sm:w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, health))}%` }}
              />
            </div>
          </div>

          {/* Eco Coins */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{ecoCoins}</span>
          </div>

          {/* Score */}
          <div className="text-xs font-bold text-emerald-400">
            <span className="text-[10px] text-slate-400 mr-1">SKOR:</span>
            <span>{score}</span>
          </div>

          {/* Relaxed Educational Timer */}
          <div className="relative flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTimer(timerSeconds)}</span>
            {bonusTimerAnimation && (
              <span className="absolute -top-4 right-0 text-[10px] font-bold text-emerald-400 animate-pulse">
                +5s Bonus!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CENTER PROXIMITY PROMPT ([E] Ketuk / Tekan Interaksi) */}
      {/* ======================================================== */}
      {proximityPrompt && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto animate-fade-in">
          <button
            type="button"
            onClick={onTriggerInteraction}
            className="group px-5 py-3 rounded-2xl bg-emerald-600/95 hover:bg-emerald-500 active:scale-95 border-2 border-emerald-300 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-3 backdrop-blur-md cursor-pointer transition"
          >
            <span className="px-2 py-1 rounded-md bg-slate-950 text-emerald-400 font-mono text-xs border border-emerald-400/40">
              E
            </span>
            <span className="drop-shadow">{proximityPrompt.promptText}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTITLE BAR (Optional for sound-off / IFP class learning) */}
      {/* ======================================================== */}
      {subtitlesEnabled && currentSubtitle && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none max-w-xl w-[90vw] text-center">
          <div className="bg-slate-950/90 border border-emerald-500/40 px-4 py-2 rounded-xl text-emerald-200 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md">
            {currentSubtitle}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      {/* ======================================================== */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white text-[11px] font-semibold flex items-center gap-1 shadow-md hover:bg-slate-800 transition cursor-pointer"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> Tampilkan Kontrol
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> Sembunyikan Kontrol
            </>
          )}
        </button>

        {/* Action Dock Container */}
        {!isDockCollapsed && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-[94vw] overflow-x-auto">
            {/* Tombol Peta Misi */}
            <button
              type="button"
              onClick={onOpenMissionMap}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer shrink-0"
              title="Peta Misi: Lompat Bebas ke Level Manapun"
            >
              <Map className="w-4 h-4 text-amber-300" />
              <span>Peta Misi</span>
            </button>

            {/* Tas Pemulihan (Inventory) */}
            <button
              type="button"
              onClick={onOpenInventory}
              className="relative px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Backpack className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Tas Pemulihan</span>
              {inventory.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                  {inventory.length}
                </span>
              )}
            </button>

            {/* Suara Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isMuted
                  ? 'bg-rose-950/50 border-rose-800 text-rose-400'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Aksesibilitas */}
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              title="Aksesibilitas & Tampilan"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Bantuan / Pause */}
            <button
              type="button"
              onClick={onOpenPause}
              className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Petunjuk</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
