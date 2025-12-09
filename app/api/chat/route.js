// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたはユーザーの分身AIとして返事します。" },
        body, // { role: 'user', content: '...' }
      ],
    }),
  });

  const data = await res.json();

  const message = {
    role: "assistant",
    content: data.choices?.[0]?.message?.content ?? "エラーが発生しました。",
  };

  return NextResponse.json(message);
}
