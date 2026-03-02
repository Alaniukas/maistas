'use client';

import React from 'react';
import { MealType } from '@/types';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (meal: MealType) => void;
}

const MEALS: { type: MealType; label: string; emoji: string; desc: string }[] = [
  { type: 'breakfast', label: 'Pusryčiai', emoji: '🌅', desc: 'Ryto valgis' },
  { type: 'lunch', label: 'Pietūs', emoji: '☀️', desc: 'Pietų valgis' },
  { type: 'dinner', label: 'Vakarienė', emoji: '🌙', desc: 'Vakaro valgis' },
  { type: 'snack', label: 'Užkandis', emoji: '🍎', desc: 'Tarpinis valgis' },
];

export function MealSelector({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md p-6 pb-10 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">Pasirinkite valgymą</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 active:scale-90">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MEALS.map(m => (
            <button
              key={m.type}
              onClick={() => onSelect(m.type)}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-primary-200 hover:bg-primary-50 active:scale-95 transition-all"
            >
              <span className="text-3xl">{m.emoji}</span>
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-800">{m.label}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
