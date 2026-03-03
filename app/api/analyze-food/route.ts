import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const foodItemSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Maisto pavadinimas lietuviškai' },
    calories: { type: Type.NUMBER, description: 'Kalorijos (kcal) per 100g' },
    protein: { type: Type.NUMBER, description: 'Baltymai (g) per 100g' },
    carbs: { type: Type.NUMBER, description: 'Angliavandeniai (g) per 100g' },
    fat: { type: Type.NUMBER, description: 'Riebalai (g) per 100g' },
    estimatedServing: { type: Type.NUMBER, description: 'Numatomas porcijos dydis gramais' },
  },
  required: ['name', 'calories', 'protein', 'carbs', 'fat', 'estimatedServing'],
};

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: 'Visi nuotraukoje matomi maisto produktai ar patiekalai',
      items: foodItemSchema,
    },
  },
  required: ['items'],
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API raktas nenurodytas' }, { status: 500 });
    const ai = new GoogleGenAI({ apiKey });

    const { base64Image, mimeType = 'image/jpeg' } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: 'Nuotrauka privaloma' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: `Identifikuok VISUS maisto produktus ar patiekalus šioje nuotraukoje.
              Jei ant lėkštės yra keli skirtingi patiekalai ar produktai – grąžink kiekvieną atskirai.
              Jei tai pakuotė su maistine lentele – nuskaityk ją tiksliai.
              Kiekvienam produktui pateik maistinę vertę per 100g ir numatomą porcijos dydį.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionSchema,
        systemInstruction: `Tu esi profesionalus dietologas, išmanantis lietuvišką rinką ir produktus.
        Atpažink VISUS maisto produktus nuotraukoje. Jei matai kelis skirtingus patiekalus ar produktus – išvardyk kiekvieną atskirai.
        Naudok lietuviškus pavadinimus.`,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Tuščias atsakymas');

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze food error:', error);
    return NextResponse.json({ error: 'Nepavyko išanalizuoti nuotraukos' }, { status: 500 });
  }
}
