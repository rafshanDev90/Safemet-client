import products from '../lib/catalog.js';

function send(res, status, body) {
  res.status(status).json(body);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return send(res, 405, { success: false, message: 'Method not allowed' });
  }

  const { category, limit = '100' } = req.query;
  const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);

  let items = [...products];
  if (category && category !== 'all') {
    items = items.filter((p) => p.category === category);
  }

  items = items.sort((a, b) => a.order - b.order).slice(0, parsedLimit);

  return send(res, 200, {
    success: true,
    message: 'Products retrieved successfully',
    data: items,
  });
}