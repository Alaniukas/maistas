# Maistė – API ir Konfigūracijos Vadovas

## 1. Supabase Sukūrimas

### 1.1 Sukurkite projektą
1. Eikite į [supabase.com](https://supabase.com) ir prisijunkite
2. Spustelkite **"New project"**
3. Įveskite projekto pavadinimą (pvz., `maiste`)
4. Pasirinkite regioną (rekomenduojama: `eu-central-1` – Frankfurtas)
5. Laukite ~2 min kol projektas sukuriamas

### 1.2 Duomenų bazės schema
1. Kairiajame meniu eikite į **SQL Editor**
2. Spustelkite **"New query"**
3. Nukopijuokite ir paleiskite visą `supabase/migrations/001_init.sql` failą
4. Patikrinkite, ar visos lentelės sukurtos: **Table Editor** > turėtumėte matyti:
   - `profiles`
   - `daily_logs`
   - `food_entries`
   - `weight_history`

### 1.3 Anoniminis autentifikavimas
1. Eikite į **Authentication > Providers**
2. Suraskite **"Anonymous Sign-ins"**
3. Įjunkite (Toggle ON)
4. Išsaugokite

### 1.4 API raktai
1. Eikite į **Project Settings > API**
2. Nukopijuokite:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Gemini API Raktas

1. Eikite į [aistudio.google.com](https://aistudio.google.com/apikey)
2. Prisijunkite su Google paskyra
3. Spustelkite **"Create API key"**
4. Nukopijuokite raktą → `GEMINI_API_KEY`

> **Svarbu:** Gemini API turi nemokamą planą su limitu:
> - 15 užklausų per minutę
> - 1,500 užklausų per dieną
> - Nemokamai iki 1M tokenų/mėn

---

## 3. .env.local Failas

Sukurkite `.env.local` failą projekto šakninėje direktorijoje:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSy...
```

---

## 4. Paleidimas

```bash
# Įdiegti priklausomybes
npm install

# Paleisti kūrimo serverį
npm run dev

# Atidaryti naršyklėje
# http://localhost:3000
```

---

## 5. Vercel Deployment

1. Prisijunkite prie [vercel.com](https://vercel.com)
2. Spustelkite **"New Project"** > importuokite iš GitHub
3. Eikite į **Environment Variables** ir pridėkite:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Spustelkite **"Deploy"**

---

## 6. Naudojamos paslaugos (nemokamos)

| Paslauga | Tikslas | Planas |
|----------|---------|--------|
| **Supabase** | Duomenų bazė + Autentifikavimas | Free (500MB, 50k MAU) |
| **Gemini API** | AI chatbot, nuotraukų analizė, mitybos planai | Free (1M tokenų/mėn) |
| **Open Food Facts** | Maisto paieška ir barkodai | Nemokama, atvira DB |
| **Vercel** | Hosting | Free (Hobby) |

---

## 7. Funkcijos

| Funkcija | Aprašymas |
|----------|-----------|
| 🔐 Anoniminis prisijungimas | Automatinis, nereikia registracijos |
| 📊 Kalorijų skaičiavimas | Mifflin-St Jeor formulė + aktyvumo koeficientas |
| 🍽️ Maisto paieška | Vietinė DB + Open Food Facts API |
| 🤖 DI maisto vertinimas | Gemini analizuoja tekstą |
| 📸 Nuotraukų analizė | Gemini Vision atpažįsta maistą |
| 🔢 Barkodų skenavimas | Open Food Facts DB |
| 💬 Mitybos chatbot | Gemini + lietuviški atsakymai |
| 📋 Mitybos planai | AI generuoja 7 dienų planą |
| 📈 Svorio istorija | Grafikas su progresu |
| 💧 Vandens stebėjimas | Dieninis matuoklis |
| 🔥 Streak'ai | Kiekvienos dienos loginimasis |
| ⚡ Dienos check-in | Klausimynas su rekomendacijomis |
