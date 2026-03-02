'use client';

import React from 'react';
import { GamificationState } from '@/types';
import { Flame } from 'lucide-react';

interface Props {
  state: GamificationState;
}

export function Gamification({ state }: Props) {
  if (state.streakDays < 1) return null;
  return (
    <div className="flex items-center gap-1 bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full border border-orange-200">
      <Flame size={14} fill="currentColor" />
      <span className="text-xs font-bold">{state.streakDays}</span>
    </div>
  );
}
