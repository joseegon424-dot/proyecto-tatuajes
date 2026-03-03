import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar el cliente de OpenAI. Validar la key en .env.local
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ reply: 'La clave de OpenAI no está configurada en .env.local.' }, { status: 500 });
        }

        const systemMessage = {
            role: 'system',
            content: `Eres el Asistente Virtual Oficial de InkMaster Studio, un estudio de tatuajes de élite. Tu tono debe ser: brutalista, directo, premium, profesional, levemente artístico y siempre conciso. No usas emojis en exceso. Eres un experto en estilos de tatuajes (Realismo, Blackwork, Neotradicional, Minimalista).
      Tus objetivos:
      1. Ayudar a resolver dudas frecuentes (precios base: desde 100 EUR/USD, sesiones: mín. 2 horas).
      2. Asesorar sobre cuidados post-inyección de tinta.
      3. Guiar al cliente para que use nuestro motor de reservas online o se acerque a nuestro local.
      Reglas extrañas pero estrictas: Trata a los prospectos de "tú", usa pausas impactantes y transmite que tatuamos con calidad digna de premio Awwwards.`
        };

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Modelo recomendado por velocidad/precio
            messages: [systemMessage, ...messages],
            max_tokens: 250,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message?.content || 'Mantenimiento del servidor neuronal en progreso. Habla con un humano.';

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('API Route Error OpenAI:', error);
        return NextResponse.json(
            { reply: 'Nuestras líneas neuronales están ocupadas. Por favor, intenta de nuevo en unos momentos o contáctanos por WhatsApp.' },
            { status: 500 }
        );
    }
}
