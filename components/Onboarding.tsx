'use client';

import React, { useState } from 'react';
import { ActivityLevel, GoalSpeed, GoalType, UserProfile } from '@/types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  user: UserProfile;
  onUpdate: (u: Partial<UserProfile>) => void;
  onComplete: () => void;
}

const steps = ['Asmeninė informacija', 'Tikslas', 'Aktyvumas', 'Greitis'];

export function Onboarding({ user, onUpdate, onComplete }: Props) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else onComplete();
  };
  const back = () => setStep(s => s - 1);

  const canNext = () => {
    if (step === 0) return user.name.trim().length > 0 && user.age > 0 && user.height > 0 && user.currentWeight > 0;
    if (step === 3) return user.goalWeight > 0;
    return true;
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-[1.25rem] flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary-200 mx-auto mb-3">
          M
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Sveiki!</h1>
        <p className="text-gray-400 text-sm mt-1">Nustatykim jūsų profilį</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-5">{steps[step]}</h2>

        {step === 0 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-500 mb-1 block">Vardas</span>
              <input
                type="text"
                value={user.name}
                onChange={e => onUpdate({ name: e.target.value })}
                placeholder="Jūsų vardas"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-500 mb-1 block">Lytis</span>
              <div className="grid grid-cols-2 gap-2">
                {(['female', 'male'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => onUpdate({ gender: g })}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${user.gender === g ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-500'}`}
                  >
                    {g === 'female' ? 'Moteris' : 'Vyras'}
                  </button>
                ))}
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className="text-sm text-gray-500 mb-1 block">Amžius</span>
                <input type="number" value={user.age || ''} onChange={e => onUpdate({ age: +e.target.value })}
                  placeholder=""
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500 mb-1 block">Ūgis (cm)</span>
                <input type="number" value={user.height || ''} onChange={e => onUpdate({ height: +e.target.value })}
                  placeholder=""
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500 mb-1 block">Svoris (kg)</span>
                <input type="number" value={user.currentWeight || ''} onChange={e => onUpdate({ currentWeight: +e.target.value })}
                  placeholder=""
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {[
              { value: GoalType.LOSE_WEIGHT, label: 'Numesti svorio', emoji: '⬇️', desc: 'Kalorijų deficitas' },
              { value: GoalType.GAIN_MUSCLE, label: 'Priaugti raumenų', emoji: '💪', desc: 'Kalorijų perteklius' },
              { value: GoalType.MAINTAIN, label: 'Išlaikyti svorį', emoji: '⚖️', desc: 'Subalansuota mityba' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ goalType: opt.value })}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${user.goalType === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {[
              { value: ActivityLevel.SEDENTARY, label: 'Sėdimas darbas', desc: 'Darbas prie stalo, be papildomo sporto' },
              { value: ActivityLevel.LIGHT, label: 'Lengvas aktyvumas', desc: 'Lengvas sportas 1–3 k./sav.' },
              { value: ActivityLevel.MODERATE, label: 'Vidutinis aktyvumas', desc: 'Sportas 3–5 k./sav.' },
              { value: ActivityLevel.ACTIVE, label: 'Aktyvus', desc: 'Intensyvus sportas 6–7 k./sav.' },
              { value: ActivityLevel.VERY_ACTIVE, label: 'Labai aktyvus', desc: 'Fizinis darbas arba sportas kasdien' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ activityLevel: opt.value })}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${user.activityLevel === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm text-gray-500 mb-1 block">Tikslo svoris (kg)</span>
              <input
                type="number"
                value={user.goalWeight || ''}
                onChange={e => onUpdate({ goalWeight: +e.target.value })}
                placeholder=""
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </label>
            {user.goalType !== GoalType.MAINTAIN && (
              <div>
                <span className="text-sm text-gray-500 mb-2 block">Greitis</span>
                <div className="space-y-2">
                  {[
                    { value: GoalSpeed.SLOW, label: 'Lėtas', desc: '0.25 kg/sav. – lengviausias' },
                    { value: GoalSpeed.NORMAL, label: 'Normalus', desc: '0.5 kg/sav. – rekomenduojamas' },
                    { value: GoalSpeed.FAST, label: 'Greitas', desc: '0.75 kg/sav. – intensyvus' },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => onUpdate({ goalSpeed: opt.value })}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all ${(user.goalSpeed as number) === (opt.value as number) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <span className="font-medium text-sm text-gray-800">{opt.label}</span>
                      <span className="text-xs text-gray-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={back} className="flex items-center gap-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium">
            <ChevronLeft size={18} /> Atgal
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext()}
          className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-primary-200"
        >
          {step === steps.length - 1 ? 'Pradėti!' : 'Toliau'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
