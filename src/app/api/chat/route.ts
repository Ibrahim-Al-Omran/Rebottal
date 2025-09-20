import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(JSON.stringify({ error: 'GROQ API key not configured' }), { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', 
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Groq API error' }, { status: response.status });
    }

    return NextResponse.json({
      response: data.choices[0].message.content,
    });

  } catch (error: unknown) {
    console.error('Groq API error:', (error as Error).message || error);
    return NextResponse.json({ error: 'Failed to get response from Groq' }, { status: 500 });
  }
}
