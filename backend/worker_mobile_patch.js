addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const C = {
  AO: ["https://mmnnb6etva5ta.kimi.page","http://localhost:5173","http://localhost:3000","capacitor://localhost","ionic://localhost","https://localhost","file://","app://localhost"],
  T: { TTL: 86400, RTTL: 604800 }
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const isMobile = !origin || origin === 'null' || origin.startsWith('capacitor://') || origin.startsWith('ionic://') || origin.startsWith('file://') || origin.startsWith('app://');
  const ao = isMobile ? (origin || 'https://localhost') : (C.AO.includes(origin) ? origin : '*');
  const h = { 'Access-Control-Allow-Origin': ao, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With', 'Access-Control-Allow-Credentials': 'true', 'Content-Type': 'application/json' };
  
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
  if (url.pathname === '/api/health') return new Response(JSON.stringify({ success: true, status: 'ok', mobile_cors: true }), { headers: h });
  if (url.pathname === '/api/login' && request.method === 'POST') { try { const b = await request.json(); return new Response(JSON.stringify({ success: true, msg: 'Login active', email: b.email }), { headers: h }); } catch(e) { return new Response(JSON.stringify({ success: false, msg: 'Invalid JSON' }), { status: 400, headers: h }); }}
  if (url.pathname === '/api/features') return new Response(JSON.stringify({ success: true, features: { mobile: true, kyc: true, tron: true, exchange: true, deposits: true, withdrawals: true } }), { headers: h });
  
  return new Response(JSON.stringify({ success: false, msg: 'Not found', path: url.pathname }), { status: 404, headers: h });
}
