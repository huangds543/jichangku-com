function parseCookies(header) {
  return String(header || '').split(';').map(value => value.trim()).filter(Boolean).reduce((all, pair) => {
    const index = pair.indexOf('='); all[index >= 0 ? pair.slice(0, index) : pair] = index >= 0 ? pair.slice(index + 1) : ''; return all;
  }, {});
}
function decodeState(raw) { try { return JSON.parse(Buffer.from(String(raw || ''), 'base64url').toString('utf8')); } catch (error) { return null; } }
function htmlResponse(origin, ok, payload) {
  const safe = JSON.stringify(payload || {}); const status = ok ? 'success' : 'error'; const message = `authorization:github:${status}:${safe}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Decap Auth</title></head><body><script>(function(){var payload=${safe};var message=${JSON.stringify(message)};var sent=false;function send(target){if(sent||!window.opener)return;sent=true;window.opener.postMessage(message,target||"*");window.opener.postMessage({type:"authorization:github:${status}",data:payload},target||"*");setTimeout(function(){window.close()},300)}if(window.opener){window.addEventListener("message",function(event){send(event.origin)},false);window.opener.postMessage("authorizing:github","*");setTimeout(function(){send("*")},1500)}})();</script><p>${ok ? 'Authentication successful.' : 'Authentication failed.'}</p></body></html>`;
}
module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID; const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return res.status(500).send('Missing GitHub OAuth environment variables');
  const state = decodeState(req.query.state); const cookieState = parseCookies(req.headers.cookie).decap_oauth_state;
  if (!req.query.code || !state || !state.csrf || !cookieState || state.csrf !== cookieState) return res.status(400).send(htmlResponse('*', false, { error: 'Invalid OAuth state' }));
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: req.query.code }) });
    const data = await response.json();
    if (!response.ok || !data.access_token) return res.status(502).send(htmlResponse(state.origin, false, { error: data.error_description || data.error || 'Token exchange failed' }));
    res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure');
    return res.status(200).send(htmlResponse(state.origin, true, { token: data.access_token, provider: 'github' }));
  } catch (error) { return res.status(500).send(htmlResponse(state.origin, false, { error: 'OAuth callback exception' })); }
};

