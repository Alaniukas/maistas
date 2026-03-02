'use client';

import React, { useState } from 'react';
import { ActivityLevel, GoalType, UserProfile } from '@/types';
import { ChevronLeft, Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  user: UserProfile;
  onBack: () => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

function EditableField({ label, value, type = 'text', onSave }: {
  label: string; value: string | number; type?: string; onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value));

  const save = () => { onSave(val); setEditing(false); toast.success('Išsaugota'); };
  const cancel = () => { setVal(String(value)); setEditing(false); };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        {editing ? (
          <input
            type={type}
            value={val}
            onChange={e => setVal(e.target.value)}
            autoFocus
            className="text-sm text-gray-800 font-medium border-b border-primary-300 outline-none bg-transparent w-full"
          />
        ) : (
          <p className="text-sm text-gray-800 font-medium">{value}</p>
        )}
      </div>
      <div className="flex gap-1 ml-3">
        {editing ? (
          <>
            <button onClick={save} className="p-1.5 text-green-500 active:scale-90"><Check size={16} /></button>
            <button onClick={cancel} className="p-1.5 text-gray-300 active:scale-90"><X size={16} /></button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="p-1.5 text-gray-300 hover:text-primary-400 active:scale-90">
            <Pencil size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Settings({ user, onBack, onUpdateUser }: Props) {
  return (
    <div className="min-h-screen bg-primary-50 pb-24">
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-semibold text-gray-800">Nustatymai</h2>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-2xl px-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide pt-4 pb-2 font-medium">Asmeninė informacija</p>
          <EditableField label="Vardas" value={user.name} onSave={v => onUpdateUser({ name: v })} />
          <EditableField label="Amžius" value={user.age} type="number" onSave={v => onUpdateUser({ age: +v })} />
          <EditableField label="Ūgis (cm)" value={user.height} type="number" onSave={v => onUpdateUser({ height: +v })} />
          <EditableField label="Dabartinis svoris (kg)" value={user.currentWeight} type="number" onSave={v => onUpdateUser({ currentWeight: +v })} />
          <EditableField label="Tikslo svoris (kg)" value={user.goalWeight} type="number" onSave={v => onUpdateUser({ goalWeight: +v })} />
          <div className="py-3">
            <p className="text-xs text-gray-400 mb-2">Lytis</p>
            <div className="flex gap-2">
              {(['female', 'male'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => { onUpdateUser({ gender: g }); toast.success('Išsaugota'); }}
                  className={`flex-1 py-2 rounded-xl text-sm border-2 transition-all ${user.gender === g ? 'border-primary-500 bg-primary-50 text-primary-600 font-medium' : 'border-gray-200 text-gray-400'}`}
                >
                  {g === 'female' ? 'Moteris' : 'Vyras'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-white rounded-2xl px-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide pt-4 pb-2 font-medium">Tikslas</p>
          <div className="space-y-2 pb-4">
            {[
              { value: GoalType.LOSE_WEIGHT, label: 'Numesti svorio', emoji: '⬇️' },
              { value: GoalType.GAIN_MUSCLE, label: 'Priaugti raumenų', emoji: '💪' },
              { value: GoalType.MAINTAIN, label: 'Išlaikyti svorį', emoji: '⚖️' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { onUpdateUser({ goalType: opt.value }); toast.success('Išsaugota'); }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${user.goalType === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
              >
                <span>{opt.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-2xl px-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide pt-4 pb-2 font-medium">Aktyvumas</p>
          <div className="space-y-2 pb-4">
            {[
              { value: ActivityLevel.SEDENTARY, label: 'Sėdimas darbas' },
              { value: ActivityLevel.LIGHT, label: 'Lengvai aktyvus' },
              { value: ActivityLevel.MODERATE, label: 'Vidutiniškai aktyvus' },
              { value: ActivityLevel.ACTIVE, label: 'Aktyvus' },
              { value: ActivityLevel.VERY_ACTIVE, label: 'Labai aktyvus' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { onUpdateUser({ activityLevel: opt.value }); toast.success('Išsaugota'); }}
                className={`w-full p-3.5 rounded-xl border-2 text-left text-sm transition-all ${user.activityLevel === opt.value ? 'border-primary-500 bg-primary-50 font-medium text-primary-700' : 'border-gray-200 text-gray-500'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-200 mx-auto mb-2">
            M
          </div>
          <p className="font-semibold text-gray-700">Maistė</p>
          <p className="text-xs text-gray-400 mt-1">v0.1.0 · Mitybos dienoraštis</p>
        </div>
      </div>
    </div>
  );
}
