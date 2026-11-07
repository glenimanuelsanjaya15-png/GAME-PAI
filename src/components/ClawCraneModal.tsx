/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Interactive 3D Claw Crane Machine Overlay (Level 3 - Laboratorium Khalifah)
 * Bergerak, Turun, Menjepit, Mengangkat, Memilah (Reduce, Reuse, Recycle)
 */

import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { sound } from '../audio/soundSystem';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HandMetal,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface ClawCraneModalProps {
  grade: GradeLevel;
  onMoveClaw: (dx: number, dz: number) => void;
  onDropClaw: (callback: (item: string, chute: 'reduce' | 'reuse' | 'recycle') => void) => void;
  onCompleteItem: (points: number, coins: number, explanation: string) => void;
  onClose: () => void;
}

interface LabItem {
  id: string;
  name: string;
  condition: string;
  correctDecision: 'reduce' | 'reuse' | 'recycle';
  explanationV: string;
  explanationVI: string;
}

const LAB_ITEMS: LabItem[] = [
  {
    id: 'c_glass',
    name: 'Toples / Botol Kaca Utuh & Bersih',
    condition: 'Kaca tebal, tidak retak, tutup rapat masih berfungsi baik.',
    correctDecision: 'reuse',
    explanationV: 'Kaca yang masih utuh sangat bagus digunakan kembali (Reuse) untuk menyimpan bumbu atau alat tulis, tidak perlu dibuang.',
    explanationVI: 'Pemanfaatan kembali (Reuse) wadah kaca menghemat energi lebur silika di pabrik dan memperpanjang siklus hidup material secara sirkular.',
  },
  {
    id: 'c_plastic_bottle',
    name: 'Botol Plastik Air Mineral Bersih (Kode 1 PET)',
    condition: 'Plastik transparan bersih, bebas minyak dan bahan kimia.',
    correctDecision: 'recycle',
    explanationV: 'Botol plastik bersih dapat didaur ulang (Recycle) menjadi serat kain atau botol baru di pabrik daur ulang.',
    explanationVI: 'Polyethylene terephthalate (PET 1) bersih memiliki nilai daur ulang mekanis tinggi untuk dipolimerisasi ulang menjadi serat dakron atau kemasan daur ulang.',
  },
  {
    id: 'c_oily_cardboard',
    name: 'Kardus Bekas Terkena Kuah Minyak Makanan',
    condition: 'Serat kardus robek dan ternoda minyak makanan basah tebal.',
    correctDecision: 'reduce',
    explanationV: 'Kardus berminyak tidak bisa dicuci jadi kertas bersih, langkah terbaik adalah mengurangi kemasan minyak (Reduce) atau dibuat kompos.',
    explanationVI: 'Kontaminasi minyak hidrofobik merusak ikatan hidrogen serat selulosa dalam proses pulping daur ulang, sehingga pencegahan pemakaian (Reduce) adalah prioritas.',
  },
  {
    id: 'c_plastic_bag',
    name: 'Kantong Kresek Hitam Tipis Sekali Pakai',
    condition: 'Tipis mudah robek, bukan bahan plastik food-grade.',
    correctDecision: 'reduce',
    explanationV: 'Kresek tipis sangat sulit didaur ulang dan mencemari tanah, hindari dan tolak pemakaiannya dengan membawa tas belanja kain (Reduce).',
    explanationVI: 'Plastik kresek LDPE rendah densitas sering terkontaminasi pewarna karbon berbahaya; strategi terbaik adalah pengurangan di hulu (source reduction / ban single-use).',
  },
  {
    id: 'c_can',
    name: 'Kaleng Alumunium Minuman Bersih',
    condition: 'Alumunium murni, ringan, tidak berkarat.',
    correctDecision: 'recycle',
    explanationV: 'Kaleng alumunium 100% bisa didaur ulang berulang kali (Recycle) tanpa mengurangi kekuatannya.',
    explanationVI: 'Daur ulang alumunium menghemat 95% energi listrik dibandingkan memproses bijih bauksit primer dari tambang tanah.',
  },
];

export const ClawCraneModal: React.FC<ClawCraneModalProps> = ({
  grade,
  onMoveClaw,
  onDropClaw,
  onCompleteItem,
  onClose,
}) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [isClawOperating, setIsClawOperating] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    success: boolean;
    decision: 'reduce' | 'reuse' | 'recycle';
    explanation: string;
  } | null>(null);

  const currentItem = LAB_ITEMS[itemIndex];

  const handleMove = (dx: number, dz: number) => {
    if (isClawOperating) return;
    onMoveClaw(dx, dz);
  };

  const handleDecision = (decision: 'reduce' | 'reuse' | 'recycle') => {
    if (isClawOperating) return;
    setIsClawOperating(true);

    onDropClaw(() => {
      const isCorrect = decision === currentItem.correctDecision;
      const explanation = grade === '5' ? currentItem.explanationV : currentItem.explanationVI;

      if (isCorrect) {
        sound.playSuccess();
        onCompleteItem(300, 5, explanation);
      } else {
        sound.playSoftBlip();
        onCompleteItem(50, 1, explanation);
      }

      setCurrentResult({
        success: isCorrect,
        decision,
        explanation,
      });

      setIsClawOperating(false);
    });
  };

  const handleNextItem = () => {
    setCurrentResult(null);
    if (itemIndex < LAB_ITEMS.length - 1) {
      setItemIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-fade-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <HandMetal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              Laboratorium Khalifah — Mesin Capit Daur Ulang ({itemIndex + 1}/{LAB_ITEMS.length})
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Analisis Fisik & Pemilahan Material
            </h2>
          </div>
        </div>

        {/* Current Target Item Box */}
        <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Benda yang Sedang Dijepit:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Uji Kelayakan
            </span>
          </div>
          <div className="text-base font-extrabold text-cyan-300">{currentItem.name}</div>
          <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-400">Kondisi Fisik: </span>
            {currentItem.condition}
          </div>
        </div>

        {/* Direct Crane Navigation Buttons (On 3D) */}
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold">
            Kemudikan Posisi Capit Mekanis di Ruang 3D:
          </span>
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              disabled={isClawOperating}
              onClick={() => handleMove(0, -1.5)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isClawOperating}
                onClick={() => handleMove(-1.5, 0)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2">CAPIT</span>
              <button
                type="button"
                disabled={isClawOperating}
                onClick={() => handleMove(1.5, 0)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              disabled={isClawOperating}
              onClick={() => handleMove(0, 1.5)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decision Action Buttons (Reduce, Reuse, Recycle) */}
        {!currentResult ? (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 text-center">
              Tentukan Keputusan Ekologis Terbaik & Lepaskan ke Tabung:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isClawOperating}
                onClick={() => handleDecision('reduce')}
                className="py-3 px-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-sm font-black">REDUCE</span>
                <span className="text-[10px] text-emerald-400 font-normal">Kurangi Dari Awal</span>
              </button>

              <button
                type="button"
                disabled={isClawOperating}
                onClick={() => handleDecision('reuse')}
                className="py-3 px-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-sm font-black">REUSE</span>
                <span className="text-[10px] text-cyan-400 font-normal">Gunakan Kembali</span>
              </button>

              <button
                type="button"
                disabled={isClawOperating}
                onClick={() => handleDecision('recycle')}
                className="py-3 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 text-xs font-bold transition flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <span className="text-sm font-black">RECYCLE</span>
                <span className="text-[10px] text-purple-400 font-normal">Daur Ulang Pabrik</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                currentResult.success
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-amber-950/80 border-amber-500 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {currentResult.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Keputusan Sangat Tepat! (+300 Poin)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Kurang Tepat, Namun Pembelajaran yang Baik!</span>
                  </>
                )}
              </div>
              <div>{currentResult.explanation}</div>
            </div>

            <button
              type="button"
              onClick={handleNextItem}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              {itemIndex < LAB_ITEMS.length - 1 ? 'Uji Benda Berikutnya' : 'Selesai Laboratorium'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
