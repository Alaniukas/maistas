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

    let response = await ai.models.generateContent({
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

    let text = response.text;
    if (!text) throw new Error('Tuščias atsakymas');

    let result = JSON.parse(text);

    // Jei nerado jokio produkto, bandome ilgesnę paiešką ieškant kažko panašaus
    if (!result.items || result.items.length === 0) {
      console.log('Pirmu bandymu produktų nerasta, bandoma detali analizė su gemini-2.5-pro...');
      const retryResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
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
                text: `Prieš tai atliekant greitą paiešką nepavyko rasti produkto. Prašau paieškoti ilgiau ir atidžiau.
                Jeigu blogiausiu atveju nerandi vaizduojamo produkto, pabandyk surasti kažką panašaus (nebūtinai identiško) pagal išvaizdą, spalvą ar formą.
                Geriau grąžinti panašiausią atitikmenį nei nieko. Pateik apytikslę maistinę vertę ir porciją.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: nutritionSchema,
          systemInstruction: `Tu esi dietologas. Privalai nuotraukoje atrasti maistą, net jei jis sunkiai atpažįstamas.
          Naudok lietuviškus pavadinimus. Jei tiksliai nežinai, prirašyk "(Panašu į ...)".`,
        },
      });

      if (retryResponse.text) {
        text = retryResponse.text;
        result = JSON.parse(text);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze food error:', error);
    return NextResponse.json({ error: 'Nepavyko išanalizuoti nuotraukos' }, { status: 500 });
  }
}
