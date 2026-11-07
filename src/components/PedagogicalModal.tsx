/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sesi Penguatan Pedagogis Level 1 - 6 (Kurikulum Merdeka PAI Fase C)
 * Refleksi, Ayat Al-Qur'an, Cek Pemahaman, & Rekomendasi Aksi Nyata
 */

import React, { useState } from 'react';
import { PedagogicalSessionData } from '../types';
import { sound } from '../audio/soundSystem';
import { BookOpen, CheckCircle, HelpCircle, ArrowRight, Sparkles, Award } from 'lucide-react';

interface PedagogicalModalProps {
  data: PedagogicalSessionData;
  onComplete: () => void;
}

export const PedagogicalModal: React.FC<PedagogicalModalProps> = ({ data, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [reflectionAnswer, setReflectionAnswer] = useState('');

  const handleSelectAnswer = (qId: string, optIndex: number, correctIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanations((prev) => ({ ...prev, [qId]: true }));
    if (optIndex === correctIndex) {
      sound.playSuccess();
    } else {
      sound.playSoftBlip();
    }
  };

  const allAnswered = data.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl text-left space-y-6 my-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Sesi Penguatan Pedagogis Level {data.level}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              {data.title}
            </h2>
          </div>
        </div>

        {/* AYAT AL-QUR'AN & TADABBUR */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
            <span>{data.quranVerse.surah} Ayat {data.quranVerse.verseNumber}</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Dalil Tauhid Ekologis
            </span>
          </div>

          <div className="text-right text-lg sm:text-2xl font-serif text-emerald-100 leading-loose py-1 font-medium">
            {data.quranVerse.arabic}
          </div>

          <div className="text-xs sm:text-sm text-slate-300 italic border-t border-emerald-900/60 pt-2 leading-relaxed">
            "{data.quranVerse.translation}"
          </div>
        </div>

        {/* RINGKASAN MATERI */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="font-bold text-emerald-400">Intisari Pembelajaran: </span>
          {data.summary}
        </div>

        {/* PERTANYAAN REFLEKSI HATI NURANI */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-amber-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Refleksi Diri Khalifah:
          </label>
          <p className="text-xs text-slate-300 italic bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl">
            {data.reflectionPrompt}
          </p>
          <textarea
            value={reflectionAnswer}
            onChange={(e) => setReflectionAnswer(e.target.value)}
            placeholder="Tuliskan renungan singkatmu di sini (opsional namun sangat dianjurkan)..."
            rows={2}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* CEK PEMAHAMAN (PERTANYAAN FORMATIF) */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Cek Pemahaman (Pilih Jawaban yang Paling Tepat):
          </div>

          {data.questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs sm:text-sm font-semibold text-white">
                {idx + 1}. {q.question}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isCorrect = optIdx === q.correctIndex;
                  const answered = selectedAnswers[q.id] !== undefined;

                  let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (answered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex)}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Penjelasan Pembahasan */}
              {showExplanations[q.id] && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed animate-fade-in">
                  <span className="font-bold text-white">Pembahasan: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* REKOMENDASI AKSI NYATA */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-200">
          <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">Misi Aksi Nyata di Dunia Nyata:</div>
            <div>{data.actionRecommendation}</div>
          </div>
        </div>

        {/* TOMBOL LANJUTKAN */}
        <button
          type="button"
          onClick={() => {
            sound.playSuccess();
            onComplete();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm sm:text-base transition cursor-pointer"
        >
          <span>Lanjutkan Misi Khalifah</span>
          <ArrowRight className="w-4 h-4 font-black" />
        </button>
      </div>
    </div>
  );
};
