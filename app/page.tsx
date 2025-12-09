'use client';
import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: boolean;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const newMessage: Message = { role: 'user', content: input };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: { 'Content-Type': 'application/json' },
    });

    const data: Message = await res.json();
    setMessages((prev) => [...prev, newMessage, data]);
    setLoading(false);
  };

  const generateImage = async () => {
    if (!input) return;
    setLoading(true);

    const res = await fetch('/api/image', {
      method: 'POST',
      body: JSON.stringify({ prompt: input }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: data.url, image: true },
    ]);

    setInput('');
    setLoading(false);
  };

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>あなたの分身AI</h2>

      <div style={{ height: 400, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {m.image ? (
              <img src={m.content} style={{ maxWidth: '100%' }} />
            ) : (
              <p><b>{m.role === 'user' ? 'あなた:' : 'AI:'}</b> {m.content}</p>
            )}
          </div>
        ))}
        {loading && <p>…考え中</p>}
      </div>

      <input
        value={input}
        style={{ width: '70%', marginTop: 10 }}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力"
      />
      <button style={{ marginLeft: 10 }} onClick={sendMessage}>送信</button>
      <button style={{ marginLeft: 10 }} onClick={generateImage}>画像生成</button>
    </main>
  );
}
