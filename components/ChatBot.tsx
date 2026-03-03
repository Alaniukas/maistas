'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, DailyLog, NutritionTargets, UserProfile, GoalType } from '@/types';
import { X, Send, MessageCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  dailyTargets: NutritionTargets;
  todayLog: DailyLog;
}

export function ChatBot({ isOpen, onClose, userProfile, dailyTargets, todayLog }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate today's totals
  const totals = useMemo(() => {
    const calories = todayLog.items.reduce((s, i) => s + Math.round(i.nutrition.calories * i.servingSize / 100), 0);
    const protein = todayLog.items.reduce((s, i) => s + Math.round(i.nutrition.protein * i.servingSize / 100), 0);
    const carbs = todayLog.items.reduce((s, i) => s + Math.round(i.nutrition.carbs * i.servingSize / 100), 0);
    const fat = todayLog.items.reduce((s, i) => s + Math.round(i.nutrition.fat * i.servingSize / 100), 0);
    return { calories, protein, carbs, fat };
  }, [todayLog]);

  // Greeting message (built fresh each open so data is current)
  const greeting = useMemo(() => {
    const remaining = dailyTargets.calories - totals.calories;
    const isOver = remaining < 0;
    if (isOver) {
      return `Sveiki, ${userProfile.name || 'vartotojau'}! 👋 Šiandien jau viršijote kalorijų limitą ${Math.abs(remaining)} kcal. Galiu patarti kaip kompensuoti arba ką rinktis rytoj!`;
    }
    if (totals.calories === 0) {
      return `Sveiki, ${userProfile.name || 'vartotojau'}! 👋 Šiandien dar nieko nevalgėte. Dienos tikslas – ${dailyTargets.calories} kcal. Kuo galiu padėti?`;
    }
    return `Sveiki, ${userProfile.name || 'vartotojau'}! 👋 Šiandien suvartoję ${totals.calories} kcal, liko ${remaining} kcal. Kuo galiu padėti?`;
  }, [userProfile.name, dailyTargets.calories, totals.calories]);

  // Set initial message when opened
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'assistant', content: greeting }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, greeting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildUserContext = () => {
    const goalLabel =
      userProfile.goalType === GoalType.LOSE_WEIGHT ? 'numesti svorio'
      : userProfile.goalType === GoalType.GAIN_MUSCLE ? 'priaugti raumenų'
      : 'išlaikyti svorį';

    const todayFoods = todayLog.items.length > 0
      ? todayLog.items.map(i => `${i.name} (${Math.round(i.nutrition.calories * i.servingSize / 100)} kcal)`).join(', ')
      : 'Nieko nepridėta';

    return {
      name: userProfile.name,
      goalLabel,
      targetCalories: dailyTargets.calories,
      consumedCalories: totals.calories,
      remainingCalories: dailyTargets.calories - totals.calories,
      remainingProtein: dailyTargets.protein - totals.protein,
      remainingCarbs: dailyTargets.carbs - totals.carbs,
      remainingFat: dailyTargets.fat - totals.fat,
      waterIntake: todayLog.waterIntake,
      todayFoods,
    };
  };

  const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const WORD_LIMIT = 70;

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    if (wordCount(text) > WORD_LIMIT) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
          userContext: buildUserContext(),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Atsiprašau, klaida.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ryšio klaida. Bandykite dar kartą.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Mitybos konsultantas</p>
            <p className="text-xs text-green-400">● Aktyvus</p>
          </div>
        </div>
        {/* Quick stats in header */}
        <div className="flex items-center gap-3 mr-2">
          <div className="text-right">
            <p className="text-xs font-bold text-primary-500">{dailyTargets.calories - totals.calories} kcal</p>
            <p className="text-[10px] text-gray-400">liko šiandien</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform">
          <X size={22} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                M
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-gradient-to-tr from-primary-500 to-primary-400 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
              M
            </div>
            <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Rašykite klausimą apie mitybą..."
            className={`flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 ${wordCount(input) > WORD_LIMIT ? 'focus:ring-red-300 ring-2 ring-red-300' : 'focus:ring-primary-300'}`}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading || wordCount(input) > WORD_LIMIT}
            className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform shadow-md shadow-primary-200 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        {wordCount(input) > 0 && (
          <p className={`text-right text-[11px] mt-1 pr-1 ${wordCount(input) > WORD_LIMIT ? 'text-red-400 font-medium' : 'text-gray-300'}`}>
            {wordCount(input)}/{WORD_LIMIT} žodžių
          </p>
        )}
      </div>
    </div>
  );
}
