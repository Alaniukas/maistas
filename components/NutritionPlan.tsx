'use client';

import React, { useState, useEffect } from 'react';
import { NutritionTargets, UserProfile } from '@/types';
import { ChevronDown, ChevronUp, Loader2, RefreshCw, ChevronLeft, BookOpen, Crown } from 'lucide-react';

interface Props {
  user: UserProfile;
  targets: NutritionTargets;
  userId?: string | null;
}

interface Meal {
  type: string;
  name: string;
  description?: string;
  recipe?: string;
  ingredients?: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime?: string;
}

interface Day {
  day: string;
  meals: Meal[];
  totalCalories: number;
}

interface Plan {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  summary: string;
  tips: string[];
  days: Day[];
  generatedAt?: string;
}

const PLAN_STORAGE_KEY = 'maiste_nutrition_plan_v2';

const MEAL_LABELS: Record<string, string> = {
  breakfast: '🌅 Pusryčiai',
  lunch: '☀️ Pietūs',
  dinner: '🌙 Vakarienė',
  snack: '🍎 Užkandis',
};

interface Question {
  key: string;
  label: string;
  emoji: string;
  options: string[];
  allowCustom: boolean;
  multiline?: boolean;
}

const QUESTIONS: Question[] = [
  {
    key: 'foodType',
    label: 'Kokio tipo maistui teikiate pirmenybę?',
    emoji: '🍽️',
    options: ['Tradicinis lietuviškas', 'Tarptautinė virtuvė', 'Augalinis / veganiška', 'Vegetariška', 'Keto / mažai angliavandenių', 'Bet koks'],
    allowCustom: true,
  },
  {
    key: 'cookingTime',
    label: 'Kiek laiko galite skirti maisto gaminimui?',
    emoji: '⏱️',
    options: ['Iki 15 min', '15–30 min', '30–60 min', 'Neribotai'],
    allowCustom: false,
  },
  {
    key: 'mealsPerDay',
    label: 'Kiek kartų per dieną valgote?',
    emoji: '🔢',
    options: ['2 kartus', '3 kartus', '4 kartus', '5+ kartus'],
    allowCustom: false,
  },
  {
    key: 'budget',
    label: 'Koks jūsų savaitinis maisto biudžetas?',
    emoji: '💶',
    options: ['Ekonomiškas (iki 30€)', 'Vidutinis (30–60€)', 'Patogu (60–100€)', 'Neribojamas'],
    allowCustom: false,
  },
  {
    key: 'allergies',
    label: 'Ar turite alergijų ar netoleravimo?',
    emoji: '⚠️',
    options: ['Nėra', 'Glitimas', 'Laktozė', 'Riešutai', 'Žuvys'],
    allowCustom: true,
  },
  {
    key: 'disliked',
    label: 'Ko norite vengti?',
    emoji: '🚫',
    options: ['Nėra apribojimų', 'Kepta mėsa', 'Žuvis', 'Daržovės', 'Aštrus maistas'],
    allowCustom: true,
  },
  {
    key: 'favoriteFoods',
    label: 'Kokie mėgstamiausi patiekalai?',
    emoji: '❤️',
    options: ['Cepelinai', 'Avižinė košė', 'Vištiena', 'Salotos', 'Makaronai'],
    allowCustom: true,
    multiline: true,
  },
  {
    key: 'healthGoals',
    label: 'Ar turite papildomų tikslų?',
    emoji: '🎯',
    options: ['Tik svorio reguliavimas', 'Daugiau energijos', 'Raumenų augimas', 'Geresnė virškinimo sistema'],
    allowCustom: true,
  },
];

export function NutritionPlan({ user, targets, userId }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Load saved plan on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Plan;
        setPlan(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const savePlan = (p: Plan) => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({ ...p, generatedAt: new Date().toISOString() }));
    } catch {
      // ignore
    }
  };

  const currentQ = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  const handleAnswer = async (answer: string) => {
    const newAnswers = { ...answers, [currentQ.key]: answer };
    setAnswers(newAnswers);
    setCustomInput('');
    if (!isLastStep) {
      setStep(s => s + 1);
    } else {
      await generatePlan(newAnswers);
    }
  };

  const generatePlan = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            age: user.age, gender: user.gender,
            currentWeight: user.currentWeight, goalWeight: user.goalWeight,
            goalType: user.goalType, activityLevel: user.activityLevel, goalSpeed: user.goalSpeed,
          },
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      savePlan(data.plan);
      setPlan(data.plan);
    } catch {
      setError('Nepavyko sugeneruoti plano. Bandykite dar kartą.');
      setStep(QUESTIONS.length - 1);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setCustomInput('');
    setPlan(null);
    setError('');
    setExpandedDay(0);
    setExpandedMeal(null);
    try { localStorage.removeItem(PLAN_STORAGE_KEY); } catch { /**/ }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-8">
        <Loader2 size={44} className="text-primary-400 animate-spin" />
        <p className="text-gray-700 font-semibold text-center">Generuojamas 3 dienų mitybos planas...</p>
        <p className="text-sm text-gray-400 text-center">AI kuria receptus ir mitybos rekomendacijas</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-4 max-w-md mx-auto space-y-4 pb-8">
        {/* Targets */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-medium">Jūsų tikslai</p>
          <div className="flex justify-around text-center">
            {[
              { label: 'Kalorijos', value: targets.calories, unit: 'kcal', color: 'text-primary-500' },
              { label: 'Baltymai', value: targets.protein, unit: 'g', color: 'text-blue-500' },
              { label: 'Ang.', value: targets.carbs, unit: 'g', color: 'text-amber-500' },
              { label: 'Riebalai', value: targets.fat, unit: 'g', color: 'text-rose-500' },
            ].map(t => (
              <div key={t.label}>
                <p className={`text-lg font-bold ${t.color}`}>{t.value}</p>
                <p className="text-[10px] text-gray-400">{t.unit}</p>
                <p className="text-[10px] text-gray-400">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="p-1.5 text-gray-400 hover:text-gray-600 active:scale-90">
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-12 text-right">{step + 1}/{QUESTIONS.length}</span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-4xl mb-3">{currentQ.emoji}</div>
          <h3 className="font-bold text-gray-800 mb-4 leading-snug">{currentQ.label}</h3>
          <div className="space-y-2">
            {currentQ.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all
                  ${answers[currentQ.key] === opt ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {currentQ.allowCustom && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-2">Arba įrašykite savo variantą:</p>
              {currentQ.multiline ? (
                <textarea
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Pvz.: Mėgstu varškės apkepą, žuvies sriubą..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                />
              ) : (
                <input
                  type="text" value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && customInput.trim() && handleAnswer(customInput.trim())}
                  placeholder="Įveskite savo atsakymą..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              )}
              <button
                onClick={() => customInput.trim() && handleAnswer(customInput.trim())}
                disabled={!customInput.trim()}
                className="mt-2 w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 active:scale-95 transition-transform"
              >
                {isLastStep ? 'Generuoti planą →' : 'Toliau →'}
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400 text-center bg-red-50 rounded-xl p-3">{error}</p>}
      </div>
    );
  }

  // ─── Plan display ──────────────────────────────────────────────────────────
  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-10">
      {/* Summary */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg shadow-primary-200">
        <div className="flex items-start justify-between mb-1">
          <p className="font-bold text-xl">✅ 3 dienų planas</p>
          {plan.generatedAt && (
            <p className="text-[10px] text-primary-200 mt-1">
              {new Date(plan.generatedAt).toLocaleDateString('lt-LT')}
            </p>
          )}
        </div>
        <p className="text-sm text-primary-100 leading-relaxed mb-4">{plan.summary}</p>
        <div className="flex justify-around text-center bg-white/10 rounded-xl py-3">
          {[
            { label: 'kcal', value: plan.targetCalories },
            { label: 'baltymai', value: `${plan.targetProtein}g` },
            { label: 'ang.', value: `${plan.targetCarbs}g` },
            { label: 'riebalai', value: `${plan.targetFat}g` },
          ].map(t => (
            <div key={t.label}>
              <p className="text-lg font-bold">{t.value}</p>
              <p className="text-[10px] text-primary-200">{t.label}/d.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {plan.tips?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-amber-700 mb-2">💡 Patarimai sėkmei</p>
          <ul className="space-y-1.5">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-xs text-amber-700 flex gap-2"><span className="text-amber-400 shrink-0">·</span>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Days */}
      {plan.days?.map((day, di) => {
        const isExpDay = expandedDay === di;
        return (
          <div key={di} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedDay(isExpDay ? null : di)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <p className="font-bold text-gray-800">{day.day}</p>
                <p className="text-xs text-gray-400 mt-0.5">{day.totalCalories} kcal iš viso</p>
              </div>
              {isExpDay ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {isExpDay && (
              <div className="border-t border-gray-50">
                {day.meals?.map((meal, mi) => {
                  const mealKey = `${di}-${mi}`;
                  const isExpMeal = expandedMeal === mealKey;
                  const hasRecipe = !!(meal.recipe || (meal.ingredients && meal.ingredients.length > 0));
                  return (
                    <div key={mi} className="border-b border-gray-50 last:border-0">
                      <button
                        onClick={() => hasRecipe && setExpandedMeal(isExpMeal ? null : mealKey)}
                        className={`w-full px-4 py-3 text-left ${hasRecipe ? 'hover:bg-gray-50 active:bg-gray-100' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-primary-500 mb-0.5">{MEAL_LABELS[meal.type] || meal.type}</p>
                            <p className="text-sm font-semibold text-gray-800 leading-snug">{meal.name}</p>
                            {meal.description && <p className="text-xs text-gray-400 mt-0.5">{meal.description}</p>}
                            {meal.prepTime && <p className="text-xs text-gray-400 mt-1">⏱ {meal.prepTime}</p>}
                          </div>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-xs font-bold text-primary-500">{meal.calories} kcal</span>
                            {hasRecipe && <BookOpen size={14} className={isExpMeal ? 'text-primary-400' : 'text-gray-300'} />}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-medium">B: {meal.protein}g</span>
                          <span className="text-[10px] bg-amber-50 text-amber-500 px-2 py-0.5 rounded-full font-medium">A: {meal.carbs}g</span>
                          <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-medium">R: {meal.fat}g</span>
                        </div>
                      </button>

                      {isExpMeal && hasRecipe && (
                        <div className="px-4 pb-4 bg-gray-50 space-y-3">
                          {meal.ingredients && meal.ingredients.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-600 mb-1.5">📦 Ingredientai:</p>
                              <ul className="space-y-1">
                                {meal.ingredients.map((ing, ii) => (
                                  <li key={ii} className="text-xs text-gray-600 flex gap-2">
                                    <span className="text-primary-400 shrink-0">·</span> {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {meal.recipe && (
                            <div>
                              <p className="text-xs font-bold text-gray-600 mb-1.5">👨‍🍳 Gaminimo instrukcija:</p>
                              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{meal.recipe}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Premium upsell */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Crown size={22} className="text-amber-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-700">Premium: 7 dienų planas</p>
          <p className="text-xs text-amber-600">Gaukite pilną savaitės planą su išsamesniais receptais</p>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-primary-300 text-primary-500 rounded-xl font-semibold text-sm active:scale-95 transition-transform hover:bg-primary-50"
      >
        <RefreshCw size={16} /> Generuoti naują planą
      </button>
    </div>
  );
}
