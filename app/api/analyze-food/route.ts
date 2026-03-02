import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Maisto pavadinimas lietuviškai' },
    calories: { type: Type.NUMBER, description: 'Kalorijos (kcal) per 100g' },
    protein: { type: Type.NUMBER, description: 'Baltymai (g) per 100g' },
    carbs: { type: Type.NUMBER, description: 'Angliavandeniai (g) per 100g' },
    fat: { type: Type.NUMBER, description: 'Riebalai (g) per 100g' },
    estimatedServing: { type: Type.NUMBER, description: 'Numatomas porcijos dydis gramais' },
    description: { type: Type.STRING, description: 'Trumpas maisto aprašymas' },
  },
  required: ['name', 'calories', 'protein', 'carbs', 'fat', 'estimatedServing'],
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
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: `Identifikuok maistą šioje nuotraukoje ir pateik maistinę vertę.
            Jei tai pakuotė su maistine lentele – nuskaityk ją tiksliai.
            Jei tai patiekalas – įvertink ingredientus ir pateik apytikslę vertę.
            Grąžink duomenis per 100g produkto ir numatymą porcijos dydžiui.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionSchema,
        systemInstruction: `Tu esi profesionalus dietologas, išmanantis lietuvišką rinką ir produktus.
        Atpažink maistą tiksliai. Naudok lietuviškus pavadinimus.`,
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
