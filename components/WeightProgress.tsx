'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, TrendingDown, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  user: UserProfile;
  userId: string | null;
  onUpdateWeight: (weight: number) => void;
  onBack: () => void;
}

interface WeightEntry { weight: number; recorded_at: string }

export function WeightProgress({ user, userId, onUpdateWeight, onBack }: Props) {
  const [history, setHistory] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('weight_history')
      .select('weight, recorded_at')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: true })
      .limit(30)
      .then(({ data }) => {
        if (data) setHistory(data as WeightEntry[]);
        setLoading(false);
      });
  }, [userId]);

  const handleAdd = async () => {
    const w = parseFloat(newWeight);
    if (!w || w < 20 || w > 300) { toast.error('Įveskite teisingą svorį'); return; }
    await onUpdateWeight(w);
    setHistory(prev => [...prev, { weight: w, recorded_at: new Date().toISOString() }]);
    setNewWeight('');
    toast.success('Svoris išsaugotas!');
  };

  const diff = user.currentWeight - user.goalWeight;
  const isLosingWeight = diff > 0;
  const minW = Math.min(...history.map(h => h.weight), user.goalWeight) - 2;
  const maxW = Math.max(...history.map(h => h.weight)) + 2;
  const range = maxW - minW || 10;

  return (
    <div className="min-h-screen bg-primary-50 pb-24">
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-semibold text-gray-800">Svorio pažanga</h2>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Dabartinis', value: `${user.currentWeight} kg`, color: 'text-gray-800' },
            { label: 'Tikslas', value: `${user.goalWeight} kg`, color: 'text-primary-600' },
            { label: 'Skirtumas', value: `${Math.abs(diff).toFixed(1)} kg`, color: diff > 0 ? 'text-red-400' : 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {history.length > 1 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Paskutinės {history.length} įrašai</p>
            <svg viewBox={`0 0 ${history.length * 40} 100`} className="w-full h-28" preserveAspectRatio="none">
              {/* Goal line */}
              <line
                x1="0" x2={history.length * 40}
                y1={((maxW - user.goalWeight) / range) * 100}
                y2={((maxW - user.goalWeight) / range) * 100}
                stroke="#ec4899" strokeDasharray="4 3" strokeWidth="1" opacity="0.4"
              />
              {/* Area */}
              <path
                d={[
                  `M 0 ${((maxW - history[0].weight) / range) * 100}`,
                  ...history.map((h, i) => `L ${i * 40} ${((maxW - h.weight) / range) * 100}`),
                  `L ${(history.length - 1) * 40} 100 L 0 100 Z`,
                ].join(' ')}
                fill="url(#weightGrad)" opacity="0.2"
              />
              {/* Line */}
              <polyline
                points={history.map((h, i) => `${i * 40},${((maxW - h.weight) / range) * 100}`).join(' ')}
                fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Dots */}
              {history.map((h, i) => (
                <circle key={i} cx={i * 40} cy={((maxW - h.weight) / range) * 100} r="3" fill="white" stroke="#ec4899" strokeWidth="2" />
              ))}
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Add weight */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">Pridėti svorį</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              placeholder={`${user.currentWeight}`}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              onClick={handleAdd}
              className="px-5 py-3 bg-primary-500 text-white rounded-xl text-sm font-medium active:scale-95 transition-transform"
            >
              Išsaugoti
            </button>
          </div>
        </div>

        {/* History list */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <p className="text-sm font-medium text-gray-700 px-4 pt-4 pb-2">Istorija</p>
            <ul className="divide-y divide-gray-50">
              {[...history].reverse().slice(0, 10).map((h, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">{new Date(h.recorded_at).toLocaleDateString('lt-LT')}</span>
                  <span className="font-medium text-gray-800">{h.weight} kg</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
