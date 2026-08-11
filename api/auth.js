const crypto = require('crypto');

function decodeSiteId(siteId) {
  try { return decodeURIComponent(siteId || ''); } catch (error) { return ''; }
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.status(500).send('Missing GITHUB_CLIENT_ID');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const callbackUrl = `${protocol}://${host}/api/callback`;
  const siteId = decodeSiteId(req.query.site_id);
  const origin = siteId || `${protocol}://${host}`;
  const csrf = crypto.randomBytes(18).toString('hex');
  const statePayload = Buffer.from(JSON.stringify({ origin, csrf }), 'utf8').toString('base64url');
  res.setHeader('Set-Cookie', `decap_oauth_state=${csrf}; Path=/; HttpOnly; SameSite=Lax; Secure`);
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizeUrl.searchParams.set('scope', 'repo');
  authorizeUrl.searchParams.set('state', statePayload);
  return res.redirect(authorizeUrl.toString());
};

