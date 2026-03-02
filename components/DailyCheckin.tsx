'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  user: UserProfile;
  onClose: () => void;
  onComplete: (data: Record<string, boolean>) => void;
}

const QUESTIONS = [
  { key: 'water', question: 'Ar išgėrėte pakankamai vandens?', emoji: '💧' },
  { key: 'breakfast', question: 'Ar pusryčiavote šiandien?', emoji: '🌅' },
  { key: 'sleep', question: 'Ar miegojote bent 7 val.?', emoji: '😴' },
  { key: 'exercise', question: 'Ar judėjote šiandien?', emoji: '🏃' },
  { key: 'vegetables', question: 'Ar valgėte daržovių?', emoji: '🥦' },
];

export function DailyCheckin({ user, onClose, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [exiting, setExiting] = useState(false);

  const current = QUESTIONS[idx];

  const answer = (val: boolean) => {
    const newAnswers = { ...answers, [current.key]: val };
    setAnswers(newAnswers);
    if (idx < QUESTIONS.length - 1) {
      setIdx(i => i + 1);
    } else {
      const score = Object.values(newAnswers).filter(Boolean).length;
      const msg = score >= 4 ? 'Puikiai! Jūs laikotės sveikos gyvensenos!' : score >= 2 ? 'Neblogai! Rytoj stenkitės dar labiau.' : 'Rytoj bus geriau!';
      toast.success(msg);
      onComplete(newAnswers);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-300 hover:text-gray-500">
          <X size={20} />
        </button>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < idx ? 'bg-primary-500' : i === idx ? 'bg-primary-300' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{current.emoji}</span>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Klausimas {idx + 1} iš {QUESTIONS.length}</p>
          <p className="font-bold text-gray-800 text-lg">{current.question}</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold text-lg active:scale-95 transition-transform hover:border-red-200 hover:bg-red-50 hover:text-red-400"
          >
            NE ❌
          </button>
          <button
            onClick={() => answer(true)}
            className="py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg active:scale-95 transition-transform shadow-lg shadow-primary-200"
          >
            TAIP ✅
          </button>
        </div>
      </div>
    </div>
  );
}
