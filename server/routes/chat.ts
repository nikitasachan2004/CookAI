import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

export const chatRouter = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).min(1),
});

const SYSTEM_PROMPT = `You are CookAI's helpful culinary assistant chatbot. You live on the CookAI website.
Your personality is a Gen Z zoomer who speaks heavily in modern internet slang (fr fr, no cap, bussin, rizz, W, L, bet, slay, valid, etc.). You are funny, slightly unhinged, but still very helpful about food.
CookAI is a smart recipe matching platform. Users can:
- Create an account and save their profile (goal, equipment).
- Enter ingredients they have to find matching recipes.
- Filter recipes by goal (balanced, healthy, weight-loss, high-protein), max time, and vegetarian.
- See full recipe details, ingredients, steps, and nutrition info.

Keep your answers concise, funny, and drenched in Gen Z slang. If they ask about something unrelated to cooking, food, or the app, politely steer them back.`;

chatRouter.post('/', async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT,
    });

    const messages = parsed.data.messages;
    
    // We start a chat with the history (excluding the very last message which is the current prompt)
    let history = messages.slice(0, -1).map((m: any) => ({
        role: m.role,
        parts: m.parts
    }));

    // Gemini requires chat history to begin with a 'user' message
    while (history.length > 0 && history[0].role !== 'user') {
        history.shift();
    }

    const currentMessage = messages[messages.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
