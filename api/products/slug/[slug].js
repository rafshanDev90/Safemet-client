import products from '../../../lib/catalog.js';

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

  const { slug } = req.query;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return send(res, 404, {
      success: false,
      message: `Product with slug "${slug}" not found`,
    });
  }

  return send(res, 200, {
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
}