import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'moonlit_celestial_secret_token_key_2026_luna_cat';

function formatGeminiContents(rawMessages) {
  const valid = (rawMessages || [])
    .filter(m => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({
      role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user',
      text: m.content.trim()
    }));

  if (valid.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello' }] }];
  }

  // Gemini constraint 1: First item in contents must have role 'user'
  let startIdx = 0;
  while (startIdx < valid.length && valid[startIdx].role === 'model') {
    startIdx++;
  }
  const slice = valid.slice(startIdx);
  if (slice.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello' }] }];
  }

  // Gemini constraint 2: Roles must strictly alternate (user -> model -> user)
  const collapsed = [];
  for (const item of slice) {
    const prev = collapsed[collapsed.length - 1];
    if (prev && prev.role === item.role) {
      prev.parts[0].text += `\n\n${item.text}`;
    } else {
      collapsed.push({ role: item.role, parts: [{ text: item.text }] });
    }
  }

  // Ensure last message is from user
  if (collapsed.length > 0 && collapsed[collapsed.length - 1].role === 'model') {
    collapsed.push({ role: 'user', parts: [{ text: 'Please continue.' }] });
  }

  return collapsed;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-gemini-key, x-openai-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Optional authentication: use userId if valid token is provided, otherwise guest/demo
  let userId = 'user_demo_seraphina';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded?.userId) userId = decoded.userId;
    } catch (err) {
      // Continue gracefully as guest rather than blocking
    }
  }

  const { messages, subject, customApiKey } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  // Resolve API Key: Custom key from user header/body takes precedence over environment variable
  const userCustomKey = req.headers['x-gemini-key'] || customApiKey;
  const geminiKey = userCustomKey || process.env.GEMINI_API_KEY;
  const openAiKey = req.headers['x-openai-key'] || process.env.OPENAI_API_KEY;

  if (!geminiKey && !openAiKey) {
    return res.status(503).json({
      configured: false,
      error: 'AI_KEY_NOT_CONFIGURED',
      message: 'Online AI Study Assistant requires a free Google Gemini API key (or OpenAI API key). Please paste your key in the assistant or configure GEMINI_API_KEY in Vercel Environment Variables. Get a free key at https://aistudio.google.com/app/apikey'
    });
  }

  const systemPrompt = `You are Luna, the Moonlit Anime Library AI Study Assistant — an intellectual, warm, and supportive academic mentor.
Your goals:
1. Help the student understand academic concepts step-by-step with intuitive explanations, analogies, and practical examples.
2. Bilingual Capability: Answer questions comfortably and naturally in simple Hindi and English (Hinglish or English), matching whatever language the student communicates in or asking to explain in Hindi/English.
3. Be encouraging, clear, and structured (use bullet points, bold key terms, and code/math formatting).
4. Support follow-up questions within the active study dialogue.
5. If the student asks about specific uploaded files, truthfully acknowledge what is available in the discussion. Do not fabricate or pretend to have read files that have not been provided.`;

  try {
    if (geminiKey) {
      const contents = formatGeminiContents(messages);

      // 1. Dynamic Model Discovery: Prioritize active models discovered via ListModels
      let modelCandidates = [];
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          const contentModels = (listData.models || []).filter(m => 
            Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent')
          );
          // Sort models: 2.0/1.5 flash models first, then other flash, then pro, then others
          contentModels.sort((a, b) => {
            const aName = (a.name || '').toLowerCase();
            const bName = (b.name || '').toLowerCase();
            const aScore = (aName.includes('flash') ? 10 : 0) + (aName.includes('2.0') ? 5 : 0) + (aName.includes('1.5') ? 3 : 0);
            const bScore = (bName.includes('flash') ? 10 : 0) + (bName.includes('2.0') ? 5 : 0) + (bName.includes('1.5') ? 3 : 0);
            return bScore - aScore;
          });
          contentModels.forEach(m => {
            const name = m.name?.startsWith('models/') ? m.name : `models/${m.name}`;
            if (!modelCandidates.includes(name)) {
              modelCandidates.push(name);
            }
          });
        }
      } catch (e) {
        // Fallback to standard model list
      }

      // Add standard fallback candidates if not present
      const defaultCandidates = [
        'models/gemini-2.0-flash',
        'models/gemini-2.0-flash-lite',
        'models/gemini-1.5-flash-latest',
        'models/gemini-1.5-flash-002',
        'models/gemini-1.5-flash-001',
        'models/gemini-1.5-flash',
        'models/gemini-2.5-flash',
        'models/gemini-pro',
        'models/gemini-1.5-pro'
      ];
      for (const d of defaultCandidates) {
        if (!modelCandidates.includes(d)) {
          modelCandidates.push(d);
        }
      }

      let lastErrorData = null;
      for (const target of modelCandidates) {
        for (const apiVer of ['v1beta', 'v1']) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/${apiVer}/${target}:generateContent?key=${geminiKey}`;
            const reqContents = JSON.parse(JSON.stringify(contents));
            const reqBody = {
              contents: reqContents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
            };

            if (apiVer === 'v1beta') {
              reqBody.systemInstruction = { parts: [{ text: systemPrompt }] };
            } else if (reqContents[0]?.parts?.[0]) {
              reqContents[0].parts[0].text = `[Instructions: ${systemPrompt}]\n\n${reqContents[0].parts[0].text}`;
            }

            const apiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reqBody)
            });

            const data = await apiRes.json();
            if (apiRes.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
              return res.status(200).json({
                reply: data.candidates[0].content.parts[0].text,
                provider: 'gemini',
                model: target,
                apiVersion: apiVer
              });
            }
            lastErrorData = data;
          } catch (e) {
            // try next candidate
          }
        }
      }

      return res.status(400).json({
        error: lastErrorData?.error?.message || 'Could not generate content with available Gemini models.',
        details: lastErrorData
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
