import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API raktas nenurodytas' }, { status: 500 });
    const ai = new GoogleGenAI({ apiKey });

    const { userProfile, answers } = await req.json();

    const { age, gender, currentWeight, goalWeight, goalType, activityLevel, goalSpeed } = userProfile;
    const { foodType, cookingTime, mealsPerDay, budget, allergies, disliked, favoriteFoods, healthGoals } = answers;

    const goalLabel =
      goalType === 'LOSE_WEIGHT' ? 'numesti svorio'
      : goalType === 'GAIN_MUSCLE' ? 'priaugti raumenų'
      : 'išlaikyti svorį';

    const activityLabel =
      activityLevel === 'SEDENTARY' ? 'sėdimas darbas'
      : activityLevel === 'LIGHT' ? 'lengvai aktyvus'
      : activityLevel === 'MODERATE' ? 'vidutiniškai aktyvus'
      : 'labai aktyvus';

    const prompt = `Sukurk išsamų 3 dienų mitybos planą lietuviškai su TIKRAIS RECEPTAIS pagal šiuos duomenis:

VARTOTOJO PROFILIS:
- Amžius: ${age} metai
- Lytis: ${gender === 'male' ? 'vyras' : 'moteris'}
- Dabartinis svoris: ${currentWeight} kg → tikslas: ${goalWeight} kg
- Tikslas: ${goalLabel}
- Aktyvumas: ${activityLabel}
- Greitis: ${goalSpeed} kg/sav.

PAGEIDAVIMAI:
- Maisto tipas: ${foodType || 'Bet koks'}
- Gaminimo laikas: ${cookingTime || '30 min'}
- Valgymai per dieną: ${mealsPerDay || '3 kartus'}
- Biudžetas: ${budget || 'Vidutinis'}
- Alergijos: ${allergies || 'Nėra'}
- Vengti: ${disliked || 'Nėra apribojimų'}
- Mėgstami patiekalai: ${favoriteFoods || 'Nenurodyta'}
- Papildomi tikslai: ${healthGoals || 'Tik svorio reguliavimas'}

Grąžink JSON formatu (be jokio papildomo teksto):
{
  "targetCalories": number,
  "targetProtein": number,
  "targetCarbs": number,
  "targetFat": number,
  "summary": "2-3 sakinių plano aprašymas",
  "tips": ["patarimas 1", "patarimas 2", "patarimas 3", "patarimas 4"],
  "days": [
    {
      "day": "Pirmadienis",
      "meals": [
        {
          "type": "breakfast",
          "name": "Patiekalo pavadinimas",
          "description": "Trumpas aprašymas",
          "prepTime": "15 min",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "ingredients": ["200g avižų dribsnių", "300ml pieno", "1 vnt. bananas"],
          "recipe": "1. Žingsnis pirmas.\\n2. Žingsnis antras.\\n3. Žingsnis trečias."
        }
      ],
      "totalCalories": number
    }
  ]
}

PRIVALOMA:
- Kiekvienas patiekalas PRIVALO turėti ingredients ir recipe laukus
- Ingredientų kiekiai gramais
- Receptas su žingsniais (numeruotais)
- Naudoti Lietuvos parduotuvėse randamus produktus
- 3 dienos su SKIRTINGAIS patiekalais`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Tuščias atsakymas');

    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
    const plan = JSON.parse(jsonStr);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Nutrition plan error:', error);
    return NextResponse.json({ error: 'Nepavyko sugeneruoti plano' }, { status: 500 });
  }
}
