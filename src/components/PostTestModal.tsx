/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Evaluasi Akhir (Post-Test Interaktif) Kurikulum Merdeka PAI Fase C
 * 10 Soal Komprehensif Berbasis CP/ATP Kelas V & VI
 */

import React, { useState, useEffect } from 'react';
import { GradeLevel, PedagogicalQuestion } from '../types';
import { POST_TEST_QUESTIONS } from '../data/learningContent';
import { sound } from '../audio/soundSystem';
import { Award, CheckCircle2, XCircle, ArrowRight, BookOpen, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostTestModalProps {
  grade: GradeLevel;
  studentName: string;
  onFinishTest: (score: number) => void;
}

export const PostTestModal: React.FC<PostTestModalProps> = ({
  grade,
  studentName,
  onFinishTest,
}) => {
  const questions: PedagogicalQuestion[] = POST_TEST_QUESTIONS[grade];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted || sound.isBgmMuted);

  // Play transition music during Post-Test evaluation
  useEffect(() => {
    sound.stopAllBgms();
    sound.playTransitionMusic();

    return () => {
      // Clean up when leaving post-test
      sound.stopTransitionMusic();
    };
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sound.setBgmMute(nextMuted);
    setIsMuted(nextMuted);
  };

  const currentQ = questions[currentIdx];

  const handleSelect = (optIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    sound.playInteract();
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    sound.playLevelFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const score = calculateScore();
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-auto text-left relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                Evaluasi Capaian Pembelajaran (PAI Fase C — Kelas {grade})
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Post-Test Pemahaman Ekologis & Amanah Khalifah
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title={isMuted ? 'Nyalakan Musik Post-Test' : 'Bisukan Musik'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <div className="text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Siswa: <span className="text-emerald-300 font-bold">{studentName}</span>
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          /* QUESTION VIEW */
          <div className="space-y-5">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Soal <span className="text-white font-bold">{currentIdx + 1}</span> dari{' '}
                {questions.length}
              </span>
              <span>Terjawab: {Object.keys(answers).length} / {questions.length}</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all flex-1 cursor-pointer ${
                    i === currentIdx
                      ? 'bg-emerald-400'
                      : answers[i] !== undefined
                      ? 'bg-emerald-800'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Question Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentIdx + 1}. {currentQ.question}
              </h3>

              <div className="space-y-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Sebelumnya
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg"
                >
                  Kirim Jawaban Post-Test
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT VIEW */
          <div className="space-y-6 animate-fade-in text-center">
            <div className="p-6 bg-gradient-to-b from-emerald-950/80 to-slate-950 border border-emerald-500/40 rounded-3xl space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Nilai Post-Test Kurikulum Merdeka PAI
              </div>
              <div className="text-5xl sm:text-6xl font-black text-white font-['Outfit']">
                {score} <span className="text-2xl text-slate-400">/ 100</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {score >= 80
                  ? 'Mumtaz! Pemahamanmu terhadap Tauhid Ekologis dan amanah Khalifah sangat mendalam.'
                  : 'Jayyid! Anda telah memahami konsep-konsep dasar pelestarian bumi Nusantara dengan baik.'}
              </p>
            </div>

            {/* Review questions with explanations */}
            <div className="text-left space-y-3 max-h-60 overflow-y-auto pr-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pembahasan Jawaban:
              </div>
              {questions.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-start gap-2 font-semibold text-white">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>
                        {idx + 1}. {q.question}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-300 pl-6 leading-relaxed">
                      <span className="font-bold text-white">Kunci & Pembahasan: </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onFinishTest(score)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base transition cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Proyek Aksi Nyata Khalifah</span>
              <ArrowRight className="w-4 h-4 font-black" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
