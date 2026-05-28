export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sunoKey = req.headers['authorization'];

  try {
    if (req.method === 'GET') {
      const { taskId } = req.query;
      const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
        headers: { 'Authorization': sunoKey }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sunoKey
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
