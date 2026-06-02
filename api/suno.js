export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-suno-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 환경변수에서 키 읽기 (앱에서 보낸 키가 없으면 환경변수 사용)
  const sunoKey = req.headers['x-suno-key'] || req.headers['authorization']?.replace('Bearer ', '') || process.env.SUNO_API_KEY;

  if (!sunoKey) {
    return res.status(401).json({ error: 'Suno API key is required' });
  }

  try {
    if (req.method === 'GET') {
      const { taskId } = req.query;
      const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
        headers: { 'Authorization': `Bearer ${sunoKey}` }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sunoKey}`
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
