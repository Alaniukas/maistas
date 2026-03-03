'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard, PlusCircle, MessageCircle, Settings2, ClipboardList, Zap, User,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import {
  ActivityLevel, GoalSpeed, GoalType, UserProfile, DailyLog, GamificationState, FoodItem, MealType, NutritionTargets,
} from '@/types';

import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';
import { FoodEntry } from '@/components/FoodEntry';
import { WeightProgress } from '@/components/WeightProgress';
import { DailyCheckin } from '@/components/DailyCheckin';
import { Settings } from '@/components/Settings';
import { Gamification } from '@/components/Gamification';
import { ChatBot } from '@/components/ChatBot';
import { NutritionPlan } from '@/components/NutritionPlan';

type View = 'dashboard' | 'addFood' | 'weight' | 'settings' | 'plan';

const INITIAL_USER: UserProfile = {
  name: '',
  age: 0,
  height: 0,
  currentWeight: 0,
  weightHistory: [],
  goalWeight: 0,
  activityLevel: ActivityLevel.SEDENTARY,
  goalType: GoalType.LOSE_WEIGHT,
  goalSpeed: GoalSpeed.NORMAL,
  gender: 'female',
  onboardingComplete: false,
  startDate: new Date().toISOString(),
};

const INITIAL_GAME: GamificationState = { streakDays: 0, lastLoginDate: '', badges: [] };

// Map Supabase profile row → UserProfile
const mapProfile = (p: Record<string, unknown>): UserProfile => ({
  name: (p.name as string) || '',
  age: (p.age as number) || 28,
  height: (p.height as number) || 170,
  currentWeight: (p.current_weight as number) || 75,
  weightHistory: [],
  goalWeight: (p.goal_weight as number) || 65,
  activityLevel: ((p.activity_level as ActivityLevel) || ActivityLevel.SEDENTARY),
  goalType: ((p.goal_type as GoalType) || GoalType.LOSE_WEIGHT),
  goalSpeed: ((p.goal_speed as GoalSpeed) || GoalSpeed.NORMAL),
  gender: ((p.gender as 'female' | 'male') || 'female'),
  onboardingComplete: (p.onboarding_complete as boolean) || false,
  startDate: (p.start_date as string) || new Date().toISOString(),
  lastCheckinTimestamp: (p.last_checkin_timestamp as number) || undefined,
});

// Map Supabase food_entry row → FoodItem
const mapFoodEntry = (e: Record<string, unknown>): FoodItem => ({
  id: e.id as string,
  name: e.name as string,
  nutrition: {
    calories: e.calories as number,
    protein: e.protein as number,
    carbs: e.carbs as number,
    fat: e.fat as number,
    sugar: e.sugar as number | undefined,
    fiber: e.fiber as number | undefined,
    saturatedFat: e.saturated_fat as number | undefined,
    sodium: e.sodium as number | undefined,
  },
  servingSize: e.serving_size as number,
  unit: (e.unit as string) || 'g',
  source: (e.source as FoodItem['source']) || 'manual',
  meal: e.meal_type as MealType,
  timestamp: (e.entry_timestamp as number) || Date.now(),
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [gameState, setGameState] = useState<GamificationState>(INITIAL_GAME);

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Today's data
  const [todayItems, setTodayItems] = useState<FoodItem[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const todayDate = new Date().toISOString().split('T')[0];

  // ─── Initialize App ────────────────────────────────────────────────────────
  useEffect(() => {
    const initApp = async () => {
      try {
        // Get or create anonymous Supabase session
        let { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { data } = await supabase.auth.signInAnonymously();
          session = data.session;
        }
        if (!session?.user?.id) { setLoading(false); return; }

        const uid = session.user.id;
        setUserId(uid);

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .maybeSingle();

        if (profile) {
          const mapped = mapProfile(profile as Record<string, unknown>);
          setUser(mapped);

          // Streak update
          const today = new Date().toISOString().split('T')[0];
          if ((profile as Record<string, unknown>).last_login_date !== today) {
            const last = (profile as Record<string, unknown>).last_login_date as string;
            let streak = ((profile as Record<string, unknown>).streak_days as number) || 0;
            if (last) {
              const diff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
              streak = diff === 1 ? streak + 1 : 1;
            } else {
              streak = 1;
            }
            setGameState((prev) => ({ ...prev, streakDays: streak, lastLoginDate: today }));
            await supabase.from('profiles').update({ streak_days: streak, last_login_date: today }).eq('id', uid);
          } else {
            setGameState((prev) => ({
              ...prev,
              streakDays: ((profile as Record<string, unknown>).streak_days as number) || 0,
              lastLoginDate: today,
            }));
          }

          // Load today's food log
          await loadTodayData(uid);
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTodayData = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0];
    const [logRes, itemsRes] = await Promise.all([
      supabase.from('daily_logs').select('water_intake').eq('user_id', uid).eq('date', today).maybeSingle(),
      supabase.from('food_entries').select('*').eq('user_id', uid).eq('date', today).order('created_at'),
    ]);
    if (logRes.data) setWaterIntake((logRes.data as Record<string, unknown>).water_intake as number || 0);
    if (itemsRes.data) setTodayItems((itemsRes.data as Record<string, unknown>[]).map(mapFoodEntry));
  };

  // ─── Calorie Calculation (Mifflin-St Jeor) ────────────────────────────────
  const dailyTargets = useMemo((): NutritionTargets => {
    if (!user.onboardingComplete) return { calories: 2000, protein: 100, carbs: 250, fat: 65 };

    let bmr: number;
    if (user.gender === 'male') {
      bmr = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      bmr = 10 * user.currentWeight + 6.25 * user.height - 5 * user.age - 161;
    }

    const multipliers: Record<ActivityLevel, number> = {
      [ActivityLevel.SEDENTARY]: 1.2,
      [ActivityLevel.LIGHT]: 1.375,
      [ActivityLevel.MODERATE]: 1.55,
      [ActivityLevel.ACTIVE]: 1.725,
      [ActivityLevel.VERY_ACTIVE]: 1.9,
    };

    let tdee = bmr * multipliers[user.activityLevel];
    let targetCalories: number;

    if (user.goalType === GoalType.LOSE_WEIGHT) {
      const dailyDeficit = (user.goalSpeed * 7700) / 7;
      targetCalories = Math.max(1200, Math.round(tdee - dailyDeficit));
    } else if (user.goalType === GoalType.GAIN_MUSCLE) {
      targetCalories = Math.round(tdee + 300);
    } else {
      targetCalories = Math.round(tdee);
    }

    const proteinRatio = user.goalType !== GoalType.MAINTAIN ? 0.35 : 0.25;
    const fatRatio = user.goalType !== GoalType.MAINTAIN ? 0.25 : 0.30;
    const carbsRatio = 1 - proteinRatio - fatRatio;

    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * proteinRatio) / 4),
      carbs: Math.round((targetCalories * carbsRatio) / 4),
      fat: Math.round((targetCalories * fatRatio) / 9),
    };
  }, [user]);

  // ─── Supabase Mutations ────────────────────────────────────────────────────
  const handleUpdateUser = useCallback(async (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    if (!userId) return;

    const db: Record<string, unknown> = {};
    const map: Record<string, string> = {
      name: 'name', age: 'age', height: 'height', currentWeight: 'current_weight',
      goalWeight: 'goal_weight', activityLevel: 'activity_level', goalType: 'goal_type',
      goalSpeed: 'goal_speed', gender: 'gender', onboardingComplete: 'onboarding_complete',
      startDate: 'start_date', lastCheckinTimestamp: 'last_checkin_timestamp',
    };
    for (const [k, v] of Object.entries(updates)) {
      if (map[k]) db[map[k]] = v;
    }
    if (Object.keys(db).length > 0) {
      await supabase.from('profiles').upsert({ id: userId, ...db, updated_at: new Date().toISOString() });
    }
  }, [userId]);

  const handleOnboardingComplete = useCallback(async () => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('profiles').upsert({
      id: userId,
      name: user.name,
      age: user.age,
      height: user.height,
      current_weight: user.currentWeight,
      goal_weight: user.goalWeight,
      activity_level: user.activityLevel,
      goal_type: user.goalType,
      goal_speed: user.goalSpeed,
      gender: user.gender,
      onboarding_complete: true,
      start_date: today,
      streak_days: 1,
      last_login_date: today,
    });
    setUser((prev) => ({ ...prev, onboardingComplete: true }));
    setGameState({ streakDays: 1, lastLoginDate: today, badges: [] });
  }, [userId, user]);

  const handleAddFood = useCallback(async (item: FoodItem) => {
    if (!userId) return;

    if (editingItem) {
      await supabase.from('food_entries').update({
        name: item.name,
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        carbs: item.nutrition.carbs,
        fat: item.nutrition.fat,
        sugar: item.nutrition.sugar ?? null,
        fiber: item.nutrition.fiber ?? null,
        saturated_fat: item.nutrition.saturatedFat ?? null,
        sodium: item.nutrition.sodium ?? null,
        serving_size: item.servingSize,
        unit: item.unit,
        source: item.source,
        meal_type: item.meal,
      }).eq('id', item.id);
      setTodayItems((prev) => prev.map((i) => i.id === item.id ? item : i));
    } else {
      const { data: newRow } = await supabase.from('food_entries').insert({
        user_id: userId,
        date: todayDate,
        name: item.name,
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        carbs: item.nutrition.carbs,
        fat: item.nutrition.fat,
        sugar: item.nutrition.sugar ?? null,
        fiber: item.nutrition.fiber ?? null,
        saturated_fat: item.nutrition.saturatedFat ?? null,
        sodium: item.nutrition.sodium ?? null,
        serving_size: item.servingSize,
        unit: item.unit,
        source: item.source,
        meal_type: item.meal,
        entry_timestamp: Date.now(),
      }).select().single();
      if (newRow) setTodayItems((prev) => [...prev, mapFoodEntry(newRow as Record<string, unknown>)]);
    }

    setEditingItem(null);
    setCurrentView('dashboard');
  }, [userId, editingItem, todayDate]);

  const handleRemoveFood = useCallback(async (itemId: string) => {
    await supabase.from('food_entries').delete().eq('id', itemId);
    setTodayItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const handleWater = useCallback(async (amount: number) => {
    if (!userId) return;
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);
    await supabase.from('daily_logs').upsert(
      { user_id: userId, date: todayDate, water_intake: newAmount, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    );
  }, [userId, waterIntake, todayDate]);

  const handleResetWater = useCallback(async () => {
    if (!userId) return;
    setWaterIntake(0);
    await supabase.from('daily_logs').upsert(
      { user_id: userId, date: todayDate, water_intake: 0, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' }
    );
  }, [userId, todayDate]);

  const handleUpdateWeight = useCallback(async (weight: number) => {
    if (!userId) return;
    await Promise.all([
      supabase.from('weight_history').insert({ user_id: userId, weight, recorded_at: new Date().toISOString() }),
      supabase.from('profiles').update({ current_weight: weight, updated_at: new Date().toISOString() }).eq('id', userId),
    ]);
    setUser((prev) => ({ ...prev, currentWeight: weight }));
  }, [userId]);

  const openAddFood = (meal: MealType) => {
    setEditingItem(null);
    setSelectedMeal(meal);
    setCurrentView('addFood');
  };

  const handleEditFood = (item: FoodItem) => {
    setEditingItem(item);
    setSelectedMeal(item.meal);
    setCurrentView('addFood');
  };

  const todayLog: DailyLog = { date: todayDate, items: todayItems, waterIntake };

  // ─── Loading Screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-[1.25rem] flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary-200">
          M
        </div>
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-primary-600 font-medium text-sm">Jungiamasi...</p>
      </div>
    );
  }

  // ─── Onboarding ───────────────────────────────────────────────────────────
  if (!user.onboardingComplete) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <Onboarding
          user={user}
          onUpdate={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
          onComplete={handleOnboardingComplete}
        />
      </div>
    );
  }

  // ─── Main App ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-primary-50 text-slate-800 pb-24 font-sans selection:bg-primary-200">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-200">
            M
          </div>
          <h1 className="font-bold text-base text-gray-800">Maistė</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('settings')} className="text-gray-400 hover:text-gray-600 active:scale-90 transition-transform">
            <User size={22} />
          </button>
          <Gamification state={gameState} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto relative">
        {/* Check-in Floating Button */}
        {currentView === 'dashboard' && (
          <button
            onClick={() => setShowCheckin(true)}
            className="fixed right-4 bottom-28 z-40 bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full shadow-xl shadow-indigo-200 text-white border-2 border-white active:scale-90 transition-transform animate-bounce-slow"
          >
            <Zap size={24} fill="white" />
          </button>
        )}

        {currentView === 'dashboard' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Sveiki, {user.name || 'vartotojau'}! 👋
              </h2>
              <p className="text-sm text-gray-400">{new Date().toLocaleDateString('lt-LT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <Dashboard
              user={user}
              dailyLog={todayLog}
              targets={dailyTargets}
              onAddWater={handleWater}
              onResetWater={handleResetWater}
              onOpenAddFood={openAddFood}
              onRemoveFood={handleRemoveFood}
              onEditFood={handleEditFood}
              onOpenWeight={() => setCurrentView('weight')}
            />
          </div>
        )}

        {currentView === 'plan' && (
          <div>
            <div className="p-4 sticky top-14 bg-primary-50 z-10">
              <h2 className="text-xl font-bold text-gray-800">Mitybos planas 📋</h2>
              <p className="text-sm text-gray-400">AI personalizuotos rekomendacijos</p>
            </div>
            <NutritionPlan user={user} targets={dailyTargets} userId={userId} />
          </div>
        )}

        {currentView === 'addFood' && (
          <FoodEntry
            onAdd={handleAddFood}
            onCancel={() => { setCurrentView('dashboard'); setEditingItem(null); }}
            mealType={selectedMeal}
            initialItem={editingItem}
          />
        )}

        {currentView === 'weight' && (
          <WeightProgress
            user={user}
            userId={userId}
            onUpdateWeight={handleUpdateWeight}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </main>

      {/* ChatBot */}
      <ChatBot
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        userProfile={user}
        dailyTargets={dailyTargets}
        todayLog={todayLog}
      />

      {/* Daily Check-in */}
      {showCheckin && (
        <DailyCheckin
          user={user}
          onClose={() => setShowCheckin(false)}
          onComplete={(data) => {
            handleUpdateUser({ lastCheckinTimestamp: Date.now() });
            setShowCheckin(false);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-2 py-2 flex justify-around items-center z-20 pb-safe">
        <NavBtn
          label="Diena"
          icon={<LayoutDashboard size={22} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />}
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        />
        <NavBtn
          label="Planas"
          icon={<ClipboardList size={22} strokeWidth={currentView === 'plan' ? 2.5 : 2} />}
          active={currentView === 'plan'}
          onClick={() => setCurrentView('plan')}
        />

        {/* Center Add Button */}
        <button
          onClick={() => { setSelectedMeal(null); setCurrentView('addFood'); }}
          className="flex items-center justify-center -mt-8 bg-primary-500 text-white w-16 h-16 rounded-full shadow-xl shadow-primary-200 border-4 border-white active:scale-95 transition-transform"
        >
          <PlusCircle size={30} />
        </button>

        <NavBtn
          label="Pokalbis"
          icon={<MessageCircle size={22} strokeWidth={showChat ? 2.5 : 2} />}
          active={showChat}
          onClick={() => setShowChat(true)}
        />
        <NavBtn
          label="Nustatymai"
          icon={<Settings2 size={22} strokeWidth={currentView === 'settings' ? 2.5 : 2} />}
          active={currentView === 'settings'}
          onClick={() => setCurrentView('settings')}
        />
      </nav>
    </div>
  );
}

function NavBtn({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${active ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-50'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
