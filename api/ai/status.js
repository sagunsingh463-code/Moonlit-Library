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

  const userCustomKey = req.headers['x-gemini-key'] || req.query?.key;
  const geminiKey = userCustomKey || process.env.GEMINI_API_KEY;
  const openAiKey = req.headers['x-openai-key'] || process.env.OPENAI_API_KEY;
  const configured = Boolean(geminiKey || openAiKey);
  const provider = geminiKey ? 'gemini' : (openAiKey ? 'openai' : 'none');

  return res.status(200).json({
    configured,
    provider,
    model: geminiKey ? 'gemini-1.5-flash' : (openAiKey ? 'gpt-4o-mini' : null)
  });
}
