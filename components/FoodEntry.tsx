'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FoodItem, MealType } from '@/types';
import { searchLocalFood, searchRemoteFood, FoodSearchResult } from '@/services/foodService';
import { Search, Camera, Loader2, X, ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onAdd: (item: FoodItem) => void;
  onCancel: () => void;
  mealType: MealType | null;
  initialItem?: FoodItem | null;
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Pusryčiai',
  lunch: 'Pietūs',
  dinner: 'Vakarienė',
  snack: 'Užkandžiai',
};

export function FoodEntry({ onAdd, onCancel, mealType, initialItem }: Props) {
  const [query, setQuery] = useState(initialItem?.name || '');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [selected, setSelected] = useState<FoodSearchResult | null>(
    initialItem
      ? { id: initialItem.id, name: initialItem.name, nutrition: initialItem.nutrition, servingSize: initialItem.servingSize, unit: initialItem.unit, source: initialItem.source }
      : null
  );
  const [serving, setServing] = useState(initialItem?.servingSize || 100);
  const [searching, setSearching] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tab, setTab] = useState<'search' | 'camera' | 'manual'>('search');
  const [showMealPicker, setShowMealPicker] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Manual entry state
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search with debounce
  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setSelected(null);
    if (q.length < 1) { setResults([]); setShowDropdown(false); return; }

    // Show local results immediately
    const local = searchLocalFood(q);
    setResults(local);
    setShowDropdown(true);

    // Debounce remote search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length >= 2) {
      setSearching(true);
      debounceRef.current = setTimeout(async () => {
        const remote = await searchRemoteFood(q);
        setResults(prev => {
          const ids = new Set(prev.map(r => r.id));
          return [...prev, ...remote.filter(r => !ids.has(r.id))].slice(0, 15);
        });
        setSearching(false);
      }, 500);
    }
  }, []);

  const handleSelectResult = (r: FoodSearchResult) => {
    setSelected(r);
    setServing(r.servingSize);
    setQuery(r.name);
    setShowDropdown(false);
    setResults([]);
  };

  // AI text estimate
  const handleEstimate = async () => {
    if (!query.trim()) return;
    setEstimating(true);
    try {
      const res = await fetch('/api/estimate-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      if (data.error) { toast.error('Nepavyko įvertinti'); return; }
      const result: FoodSearchResult = {
        id: `gemini-${Date.now()}`,
        name: data.name,
        nutrition: { calories: data.calories, protein: data.protein, carbs: data.carbs, fat: data.fat },
        servingSize: data.estimatedServing || 100,
        unit: 'g',
        source: 'gemini',
      };
      handleSelectResult(result);
    } catch {
      toast.error('Klaida');
    } finally {
      setEstimating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setTab('search');
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        try {
          const res = await fetch('/api/analyze-food', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Image: base64, mimeType: file.type }),
          });
          const data = await res.json();
          if (data.error) { toast.error('Nepavyko išanalizuoti'); setAnalyzing(false); return; }
          const result: FoodSearchResult = {
            id: `gemini-photo-${Date.now()}`,
            name: data.name,
            nutrition: { calories: data.calories, protein: data.protein, carbs: data.carbs, fat: data.fat },
            servingSize: data.estimatedServing || 100,
            unit: 'g',
            source: 'gemini',
          };
          handleSelectResult(result);
          toast.success(`Atpažinta: ${data.name}`);
        } catch {
          toast.error('Klaida analizuojant nuotrauką');
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Nepavyko nuskaityti failo');
      setAnalyzing(false);
    }
  };

  const [pendingManualItem, setPendingManualItem] = useState<FoodItem | null>(null);

  const handleAddManual = () => {
    if (!manual.name || !manual.calories) { toast.error('Įveskite pavadinimą ir kalorijas'); return; }
    const item: FoodItem = {
      id: `manual-${Date.now()}`,
      name: manual.name,
      nutrition: {
        calories: +manual.calories,
        protein: +manual.protein || 0,
        carbs: +manual.carbs || 0,
        fat: +manual.fat || 0,
      },
      servingSize: 100,
      unit: 'g',
      source: 'manual',
      meal: mealType ?? 'breakfast',
      timestamp: Date.now(),
    };
    if (!mealType) {
      setPendingManualItem(item);
      setShowMealPicker(true);
    } else {
      onAdd(item);
    }
  };

  const buildAndAdd = (meal: MealType) => {
    if (!selected) return;
    const item: FoodItem = {
      id: initialItem?.id || `${selected.id}-${Date.now()}`,
      name: selected.name,
      nutrition: selected.nutrition,
      servingSize: serving,
      unit: selected.unit,
      source: selected.source,
      meal,
      timestamp: Date.now(),
    };
    onAdd(item);
  };

  const handleAdd = () => {
    if (!selected) return;
    if (!mealType) {
      setShowMealPicker(true);
      return;
    }
    buildAndAdd(mealType);
  };

  const calcNutrient = (val: number) => Math.round(val * serving / 100);

  const MEAL_OPTIONS: { type: MealType; label: string; emoji: string }[] = [
    { type: 'breakfast', label: 'Pusryčiai', emoji: '🌅' },
    { type: 'lunch', label: 'Pietūs', emoji: '☀️' },
    { type: 'dinner', label: 'Vakarienė', emoji: '🌙' },
    { type: 'snack', label: 'Užkandžiai', emoji: '🍎' },
  ];

  return (
    <div className="min-h-screen bg-primary-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="font-semibold text-gray-800">{initialItem ? 'Redaguoti' : 'Pridėti maistą'}</h2>
          <p className="text-xs text-gray-400">{mealType ? MEAL_LABELS[mealType] : 'Pasirinksite valgymo laiką pridedant'}</p>
        </div>
      </div>

      {/* Meal picker overlay */}
      {showMealPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowMealPicker(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="text-center font-semibold text-gray-800 mb-4">Kuriam valgymo laikui?</p>
            <div className="grid grid-cols-2 gap-3">
              {MEAL_OPTIONS.map(m => (
                <button
                  key={m.type}
                  onClick={() => {
                    setShowMealPicker(false);
                    if (pendingManualItem) {
                      onAdd({ ...pendingManualItem, meal: m.type });
                      setPendingManualItem(null);
                    } else {
                      buildAndAdd(m.type);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-4 bg-primary-50 rounded-2xl active:scale-95 transition-transform border border-primary-100"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="font-semibold text-gray-700 text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: 'search', label: 'Paieška', icon: <Search size={14} /> },
            { id: 'camera', label: '📷 Nuotrauka', icon: null },
            { id: 'manual', label: 'Rankiniu', icon: null },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all
                ${tab === t.id ? 'bg-primary-500 text-white shadow' : 'text-gray-400'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Search tab */}
        {tab === 'search' && (
          <div className="space-y-3">
            <div ref={searchRef} className="relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 z-10" />
                <input
                  type="text"
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={() => results.length > 0 && setShowDropdown(true)}
                  placeholder="Ieškoti maisto produkto..."
                  className="w-full pl-9 pr-10 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  autoFocus={!initialItem}
                />
                {searching && (
                  <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 animate-spin" />
                )}
                {query && !searching && (
                  <button onClick={() => { setQuery(''); setResults([]); setSelected(null); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Live dropdown */}
              {showDropdown && results.length > 0 && !selected && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 z-20 mt-1 max-h-72 overflow-y-auto">
                  {results.map(r => (
                    <button
                      key={r.id}
                      onMouseDown={() => handleSelectResult(r)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary-50 active:bg-primary-100 border-b border-gray-50 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                        <p className="text-xs text-gray-400">
                          {Math.round(r.nutrition.calories)} kcal · B:{Math.round(r.nutrition.protein)}g · A:{Math.round(r.nutrition.carbs)}g · R:{Math.round(r.nutrition.fat)}g
                          <span className="ml-2 text-primary-400">{r.source === 'local' ? '🇱🇹' : '🌍'}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                  {/* AI estimate option */}
                  {query.length >= 2 && (
                    <button
                      onMouseDown={handleEstimate}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left bg-primary-50 hover:bg-primary-100 border-t border-primary-100"
                    >
                      {estimating ? <Loader2 size={14} className="animate-spin text-primary-500" /> : <span>✨</span>}
                      <div>
                        <p className="text-sm font-medium text-primary-600">AI įvertinimas: „{query}"</p>
                        <p className="text-xs text-primary-400">Gemini apskaičiuos maistinę vertę</p>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* AI estimate button when no dropdown */}
              {query.length >= 2 && !showDropdown && !selected && (
                <button
                  onClick={handleEstimate}
                  disabled={estimating}
                  className="w-full mt-2 flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-primary-200 text-primary-600 text-sm font-medium active:scale-95 transition-transform"
                >
                  {estimating ? <Loader2 size={16} className="animate-spin" /> : <span>✨</span>}
                  AI įvertinti „{query}"
                </button>
              )}
            </div>
          </div>
        )}

        {/* Camera tab */}
        {tab === 'camera' && (
          <div className="space-y-3">
            {/* Premium badge */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <span className="text-amber-500 text-base">👑</span>
              <p className="text-xs text-amber-700 font-medium">Premium funkcija – šiuo metu nemokama!</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
                <Camera size={28} className="text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Nufotografuokite maistą</p>
                <p className="text-xs text-gray-400">AI atpažins produktą ir apskaičiuos maistinę vertę automatiškai</p>
              </div>
              <label className="block">
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-transform shadow-md
                  ${analyzing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white shadow-primary-200'}`}>
                  {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  {analyzing ? 'Analizuojama...' : 'Pasirinkti nuotrauką'}
                </span>
                <input
                  type="file" accept="image/*" capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={analyzing}
                />
              </label>
              {analyzing && (
                <p className="text-xs text-gray-400 animate-pulse">AI analizuoja nuotrauką, palaukite...</p>
              )}
            </div>
          </div>
        )}

        {/* Manual tab */}
        {tab === 'manual' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <input
              type="text" placeholder="Pavadinimas" value={manual.name}
              onChange={e => setManual(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <div className="grid grid-cols-2 gap-2">
              {(['calories', 'protein', 'carbs', 'fat'] as const).map(key => (
                <div key={key}>
                  <label className="text-xs text-gray-400 block mb-1">
                    {key === 'calories' ? 'Kalorijos (kcal)' : key === 'protein' ? 'Baltymai (g)' : key === 'carbs' ? 'Angliavandeniai (g)' : 'Riebalai (g)'}
                  </label>
                  <input
                    type="number" value={manual[key]}
                    onChange={e => setManual(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAddManual}
              className="w-full py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
            >
              Pridėti
            </button>
          </div>
        )}

        {/* Selected food card */}
        {selected && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{selected.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.source === 'local' ? '🇱🇹 Vietinė DB' : selected.source === 'gemini' ? '✨ AI įvertinta' : '🌍 Open Food Facts'}
                </p>
              </div>
              <button onClick={() => { setSelected(null); setQuery(''); }} className="text-gray-300 hover:text-gray-500">
                <X size={18} />
              </button>
            </div>

            {/* Serving control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Porcija</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setServing(s => Math.max(5, s - 5))} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold active:scale-90">−</button>
                  <span className="text-sm font-bold text-gray-700 w-20 text-center">{serving} {selected.unit}</span>
                  <button onClick={() => setServing(s => s + 5)} className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold active:scale-90">+</button>
                </div>
              </div>
              <input
                type="range" min={5} max={1000} value={serving}
                onChange={e => setServing(+e.target.value)}
                className="w-full accent-primary-500"
              />
            </div>

            {/* Nutrition summary */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Kalorijos', value: calcNutrient(selected.nutrition.calories), unit: 'kcal', color: 'text-primary-500' },
                { label: 'Baltymai', value: calcNutrient(selected.nutrition.protein), unit: 'g', color: 'text-blue-500' },
                { label: 'Ang.', value: calcNutrient(selected.nutrition.carbs), unit: 'g', color: 'text-amber-500' },
                { label: 'Riebalai', value: calcNutrient(selected.nutrition.fat), unit: 'g', color: 'text-rose-500' },
              ].map(n => (
                <div key={n.label} className="text-center bg-gray-50 rounded-xl p-2">
                  <p className={`text-base font-bold ${n.color}`}>{n.value}</p>
                  <p className="text-[10px] text-gray-400">{n.unit}</p>
                  <p className="text-[9px] text-gray-400">{n.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 text-white rounded-xl font-semibold text-sm active:scale-95 transition-transform shadow-lg shadow-primary-200"
            >
              <Check size={18} /> {initialItem ? 'Atnaujinti' : 'Pridėti'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
