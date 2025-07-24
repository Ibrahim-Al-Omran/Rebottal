import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', 
        messages: messages,
        temperature: 0.7,
        max_tokens:100,
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

  } catch (error: any) {
    console.error('Groq API error:', error.message || error);
    return NextResponse.json({ error: 'Failed to get response from Groq' }, { status: 500 });
  }
}
