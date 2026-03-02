'use client';

import React, { useState } from 'react';
import { DailyLog, FoodItem, MealType, NutritionTargets, UserProfile } from '@/types';
import { Trash2, Pencil, Droplets, Plus, Minus, Scale } from 'lucide-react';

interface Props {
  user: UserProfile;
  dailyLog: DailyLog;
  targets: NutritionTargets;
  onAddWater: (amount: number) => void;
  onResetWater: () => void;
  onOpenAddFood: (meal: MealType) => void;
  onRemoveFood: (id: string) => void;
  onEditFood: (item: FoodItem) => void;
  onOpenWeight: () => void;
}

const MEALS: { type: MealType; label: string; emoji: string }[] = [
  { type: 'breakfast', label: 'Pusryčiai', emoji: '🌅' },
  { type: 'lunch', label: 'Pietūs', emoji: '☀️' },
  { type: 'dinner', label: 'Vakarienė', emoji: '🌙' },
  { type: 'snack', label: 'Užkandžiai', emoji: '🍎' },
];

function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{Math.round(current)}g</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Dashboard({ user, dailyLog, targets, onAddWater, onResetWater, onOpenAddFood, onRemoveFood, onEditFood, onOpenWeight }: Props) {
  const [longPressId, setLongPressId] = useState<string | null>(null);

  const totalCalories = dailyLog.items.reduce((s, i) => s + Math.round(i.nutrition.calories * i.servingSize / 100), 0);
  const totalProtein = dailyLog.items.reduce((s, i) => s + Math.round(i.nutrition.protein * i.servingSize / 100), 0);
  const totalCarbs = dailyLog.items.reduce((s, i) => s + Math.round(i.nutrition.carbs * i.servingSize / 100), 0);
  const totalFat = dailyLog.items.reduce((s, i) => s + Math.round(i.nutrition.fat * i.servingSize / 100), 0);

  const remaining = targets.calories - totalCalories;
  const calPct = Math.min(100, Math.round((totalCalories / targets.calories) * 100));
  const isOver = remaining < 0;

  const waterPct = Math.min(100, Math.round((dailyLog.waterIntake / 2500) * 100));

  return (
    <div className="space-y-4">
      {/* Calorie Ring Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Šiandien</p>
            <p className={`text-3xl font-bold ${isOver ? 'text-red-500' : 'text-gray-800'}`}>
              {Math.abs(remaining)} kcal
            </p>
            <p className="text-xs text-gray-400">{isOver ? 'per daug' : 'liko'}</p>
          </div>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke={isOver ? '#ef4444' : '#ec4899'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${calPct * 2.01} 201`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-700">{calPct}%</span>
            </div>
          </div>
        </div>

        <div className="flex text-xs text-gray-500 justify-between mb-4">
          <span>Suvartoję: <strong className="text-gray-700">{totalCalories}</strong></span>
          <span>Tikslas: <strong className="text-gray-700">{targets.calories}</strong></span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-red-400' : 'bg-gradient-to-r from-primary-400 to-primary-500'}`}
            style={{ width: `${calPct}%` }}
          />
        </div>

        {/* Macros */}
        <div className="flex gap-3">
          <MacroBar label="Baltymai" current={totalProtein} target={targets.protein} color="bg-blue-400" />
          <MacroBar label="Ang." current={totalCarbs} target={targets.carbs} color="bg-amber-400" />
          <MacroBar label="Riebalai" current={totalFat} target={targets.fat} color="bg-rose-400" />
        </div>
      </div>

      {/* Water + Weight Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Water */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-xs font-medium text-gray-600">Vanduo</span>
          </div>
          <p className="text-lg font-bold text-blue-500 mb-1">{dailyLog.waterIntake} ml</p>
          <div className="h-1.5 bg-blue-50 rounded-full mb-3">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => onAddWater(-250)} className="flex-1 py-1.5 text-xs bg-blue-50 text-blue-500 rounded-lg font-medium active:scale-95 transition-transform">-</button>
            <button onClick={() => onAddWater(250)} className="flex-1 py-1.5 text-xs bg-blue-500 text-white rounded-lg font-medium active:scale-95 transition-transform">+250ml</button>
          </div>
        </div>

        {/* Weight */}
        <button
          onClick={onOpenWeight}
          className="bg-white rounded-2xl p-4 shadow-sm text-left active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} className="text-primary-400" />
            <span className="text-xs font-medium text-gray-600">Svoris</span>
          </div>
          <p className="text-lg font-bold text-primary-500">{user.currentWeight} kg</p>
          <p className="text-xs text-gray-400 mt-1">Tikslas: {user.goalWeight} kg</p>
          <div className="h-1.5 bg-primary-50 rounded-full mt-2">
            <div
              className="h-full bg-primary-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(Math.abs(user.currentWeight - user.goalWeight) / Math.abs((user as UserProfile & { startWeight?: number }).startWeight || user.currentWeight - user.goalWeight) * 100))}%` }}
            />
          </div>
        </button>
      </div>

      {/* Meal Sections */}
      {MEALS.map(meal => {
        const items = dailyLog.items.filter(i => i.meal === meal.type);
        const mealCals = items.reduce((s, i) => s + Math.round(i.nutrition.calories * i.servingSize / 100), 0);
        return (
          <div key={meal.type} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span>{meal.emoji}</span>
                <span className="font-semibold text-sm text-gray-700">{meal.label}</span>
                {mealCals > 0 && <span className="text-xs text-gray-400">{mealCals} kcal</span>}
              </div>
              <button
                onClick={() => onOpenAddFood(meal.type)}
                className="w-7 h-7 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-4 text-xs text-gray-300 text-center">Nieko nepridėta</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map(item => {
                  const itemCals = Math.round(item.nutrition.calories * item.servingSize / 100);
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.servingSize}{item.unit} · {itemCals} kcal</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => onEditFood(item)} className="p-1.5 text-gray-300 hover:text-primary-400 active:scale-90 transition-transform">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => onRemoveFood(item.id)} className="p-1.5 text-gray-300 hover:text-red-400 active:scale-90 transition-transform">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
