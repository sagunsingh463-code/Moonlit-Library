import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'moonlit_celestial_secret_token_key_2026_luna_cat';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Verify authentication header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  let userId = null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  const { messages, subject } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openAiKey) {
    return res.status(503).json({
      configured: false,
      error: 'AI_KEY_NOT_CONFIGURED',
      message: 'Online AI Study Assistant requires a free Google Gemini API key (or OpenAI API key). Please configure GEMINI_API_KEY in your Vercel Environment Variables. Get a free key at https://aistudio.google.com/app/apikey'
    });
  }

  const systemPrompt = `You are Luna, the Moonlit Anime Library AI Study Assistant — an intellectual, warm, and supportive academic mentor.
Your goals:
1. Help the student understand academic concepts step-by-step with intuitive explanations, analogies, and practical examples.
2. Bilingual Capability: Answer questions comfortably and naturally in simple Hindi and English (Hinglish or English), matching whatever language the student communicates in.
3. Be encouraging, clear, and structured (use bullet points, bold key terms, and code/math formatting).
4. Support follow-up questions within the active study dialogue.
5. If the student asks about specific uploaded files, truthfully acknowledge what is available in the discussion. Do not fabricate or pretend to have read files that have not been provided.`;

  try {
    if (geminiKey) {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const apiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        })
      });

      const data = await apiRes.json();
      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          error: data.error?.message || 'Gemini API encountered an error.',
          details: data
        });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate an answer right now. Please try again.';
      return res.status(200).json({
        reply,
        provider: 'gemini'
      });
    } else {
      const openAiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ];

      const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: openAiMessages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });

      const data = await apiRes.json();
      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          error: data.error?.message || 'OpenAI API encountered an error.',
          details: data
        });
      }

      const reply = data.choices?.[0]?.message?.content || 'I could not generate an answer right now. Please try again.';
      return res.status(200).json({
        reply,
        provider: 'openai'
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: 'Network error communicating with AI provider.',
      message: err.message
    });
  }
}
