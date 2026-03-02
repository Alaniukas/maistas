import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Patikslintas produkto pavadinimas lietuviškai' },
    calories: { type: Type.NUMBER, description: 'Kalorijos (kcal) per 100g' },
    protein: { type: Type.NUMBER, description: 'Baltymai (g) per 100g' },
    carbs: { type: Type.NUMBER, description: 'Angliavandeniai (g) per 100g' },
    fat: { type: Type.NUMBER, description: 'Riebalai (g) per 100g' },
    estimatedServing: { type: Type.NUMBER, description: 'Numatomas porcijos dydis gramais' },
  },
  required: ['name', 'calories', 'protein', 'carbs', 'fat', 'estimatedServing'],
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API raktas nenurodytas' }, { status: 500 });
    const ai = new GoogleGenAI({ apiKey });

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Tekstas privalomas' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Pateik maistinę vertę 100g produktui (arba tipinei porcijai jei tai patiekalas) pagal užklausą: "${text}".` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionSchema,
        systemInstruction: `Tu esi profesionalus dietologas, puikiai išmanantis lietuvišką rinką.

Svarbu:
1. Jei vartotojas įveda konkretų prekės ženklą (Rimi, Maxima, Pieno žvaigždės, Vilkyškių ir kt.), naudok savo žinias.
2. Jei tai tradicinis patiekalas (cepelinai, šaltibarščiai, balandėliai), naudok standartines receptūras.
3. Grąžink rezultatus JSON formatu su maistinėmis vertėmis per 100g.`,
      },
    });

    const result = response.text;
    if (!result) throw new Error('Tuščias atsakymas');

    return NextResponse.json(JSON.parse(result));
  } catch (error) {
    console.error('Estimate food error:', error);
    return NextResponse.json({ error: 'Nepavyko apskaičiuoti' }, { status: 500 });
  }
}
