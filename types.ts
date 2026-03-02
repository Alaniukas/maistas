export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

export enum GoalType {
  LOSE_WEIGHT = 'LOSE_WEIGHT',
  GAIN_MUSCLE = 'GAIN_MUSCLE',
  MAINTAIN = 'MAINTAIN',
}

export enum GoalSpeed {
  SLOW = 0.25,
  NORMAL = 0.5,
  FAST = 0.75,
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  saturatedFat?: number;
  sodium?: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  nutrition: NutritionInfo;
  servingSize: number;
  unit: string;
  source: 'local' | 'openfoodfacts' | 'gemini' | 'manual';
  meal: MealType;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  currentWeight: number;
  weightHistory: { date: string; weight: number }[];
  goalWeight: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  goalSpeed: GoalSpeed;
  gender: 'male' | 'female';
  onboardingComplete: boolean;
  startDate: string;
  lastCheckinTimestamp?: number;
}

export interface DailyLog {
  date: string;
  items: FoodItem[];
  waterIntake: number;
}

export interface GamificationState {
  streakDays: number;
  lastLoginDate: string;
  badges: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
