'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, `Jij: ${input}`]);
    setInput('');
    setIsThinking(true);

    // Simuleer een langere API-aanroep naar de chatbot
    setTimeout(() => {
      setMessages(prev => [...prev, `Chatbot: Hier is een antwoord op "${input}"`]);
      setIsThinking(false);
    }, 5000); // Verhoogd naar 5 seconden voor een duidelijker effect
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Welkom bij Overheidsgemak</h1>
          <div className="space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">{msg}</div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Typ je vraag hier..."
            />
            <Button type="submit">Verstuur</Button>
          </form>
          <ThinkingIndicator isThinking={isThinking} />
        </CardContent>
      </Card>
    </div>
  );
}