import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API raktas nenurodytas' }, { status: 500 });
    const ai = new GoogleGenAI({ apiKey });

    const { message, history, userContext } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Žinutė privaloma' }, { status: 400 });
    }

    // Build dynamic system instruction with user's real data
    const systemInstruction = `Tu esi Maistė – asmeninis mitybos asistentas programėlėje.

SVARBU: Atsakyk TIKTAI lietuviškai. Būk draugiškas, glaustas ir praktiškas.
Kalbėk TIKTAI apie mitybą, maistą, svorio reguliavimą ir susijusias sveikatos temas.
Jei klausiama apie nesusijusias temas – mandagiai nukreipk atgal į mitybą.
Atsakymai turi būti TRUMPI – ne daugiau 3 sakiniai arba trumpas sąrašas. Visada baik pilnais, užbaigtais sakiniais. Niekada nekirpk sakinio viduryje.

ŠIANDIEN VARTOTOJO DUOMENYS:
- Vardas: ${userContext?.name || 'vartotojas'}
- Tikslas: ${userContext?.goalLabel || 'svorio reguliavimas'}
- Dienos kalorijų tikslas: ${userContext?.targetCalories || '–'} kcal
- Jau suvartota: ${userContext?.consumedCalories || 0} kcal
- Liko šiandien: ${userContext?.remainingCalories ?? '–'} kcal
- Baltymai liko: ${userContext?.remainingProtein ?? '–'} g
- Angliavandeniai liko: ${userContext?.remainingCarbs ?? '–'} g
- Riebalai liko: ${userContext?.remainingFat ?? '–'} g
- Vanduo: ${userContext?.waterIntake || 0} ml
- Šiandien suvalgyta: ${userContext?.todayFoods || 'Nieko nepridėta'}

Jei vartotojas klausia ką dar galima valgyti – atsižvelk į likusias kalorijas ir makroelementus.
Jei klausia ar viršijo limitą – pasakyk konkrečiai pagal duomenis.`;

    const contents = [
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 500,
        temperature: 0.6,
      },
    });

    const text = response.text ?? 'Atsiprašau, nepavyko atsakyti. Bandykite dar kartą.';
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Serverio klaida' }, { status: 500 });
  }
}
