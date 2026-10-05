const crypto = require("crypto");
const router = require("express").Router();

const page = (nonce) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Pay securely</title>
<style nonce="${nonce}">
:root{--navy:#0B2447;--brand:#1D4ED8;--text:#0F1B2D;--muted:#667085;--bg:#F4F6FA;--border:#E3E8EF;--ok:#15803D;--bad:#C62828}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px 16px}
.brand{font-weight:800;color:var(--navy);margin:8px 0 18px;letter-spacing:-.3px}
.card{background:#fff;border:1px solid var(--border);border-radius:18px;padding:24px;width:100%;max-width:400px;text-align:center}
.merchant{color:var(--muted);font-size:14px}
h1{font-size:18px;margin-top:6px}
.desc{color:var(--muted);font-size:14px;margin-top:4px}
.amount{font-size:40px;font-weight:800;letter-spacing:-1px;margin:18px 0}
.btn{display:block;width:100%;padding:15px;border:0;border-radius:12px;background:var(--brand);color:#fff;font-size:16px;font-weight:700;text-decoration:none;cursor:pointer;margin-top:12px}
.btn.alt{background:#EAF0FF;color:var(--brand)}
.btn:disabled{opacity:.6}
.qr{width:240px;height:240px;margin:14px auto 4px;display:block}
.note{background:#FEF3E2;color:#B45309;border-radius:10px;padding:10px 12px;font-size:13px;font-weight:600;margin-top:12px}
.small{color:var(--muted);font-size:13px;margin-top:10px}
.row{display:flex;justify-content:space-between;font-size:14px;padding:8px 0;border-bottom:1px solid var(--border)}
.row span:first-child{color:var(--muted)}
.icon{width:64px;height:64px;border-radius:50%;margin:0 auto 12px;display:grid;place-items:center;font-size:30px;color:#fff}
.hide{display:none}
</style></head><body>
<div class="brand">FamWay</div>
<div class="card" id="loading"><p class="small">Loading...</p></div>

<div class="card hide" id="info">
  <p class="merchant" id="iMerchant"></p>
  <h1 id="iTitle"></h1>
  <p class="desc" id="iDesc"></p>
  <div class="amount" id="iAmount"></div>
  <button class="btn" id="payBtn">Pay now</button>
  <p class="small" id="iErr"></p>
</div>

<div class="card hide" id="pay">
  <p class="merchant" id="pMerchant"></p>
  <div class="amount" id="pAmount"></div>
  <div class="note">Pay exactly this amount, including paise. Do not change it.</div>
  <img class="qr" id="pQr" alt="UPI QR code">
  <p class="small">Scan with any UPI app</p>
  <a class="btn hide" id="upiBtn">Open UPI app</a>
  <div style="margin-top:14px">
    <div class="row"><span>Pay to</span><span id="pUpi"></span></div>
    <div class="row"><span>Order</span><span id="pOrder"></span></div>
    <div class="row"><span>Expires in</span><span id="pTimer"></span></div>
  </div>
  <p class="small">Waiting for payment. This page updates automatically.</p>
</div>

<div class="card hide" id="done">
  <div class="icon" id="dIcon"></div>
  <h1 id="dTitle"></h1>
  <p class="desc" id="dText"></p>
  <button class="btn alt hide" id="retryBtn">Start again</button>
</div>

<script nonce="${nonce}">
(function(){
  var slug = location.pathname.split('/').filter(Boolean).pop();
  var KEY = 'fw_order_' + slug;
  var $ = function(id){ return document.getElementById(id); };
  var order = null, pollT = null, tickT = null;

  function show(id){ ['loading','info','pay','done'].forEach(function(x){ $(x).classList.toggle('hide', x !== id); }); }
  function api(path, opts){
    return fetch('/api/public' + path, opts).then(function(r){ return r.json().catch(function(){ return {}; }); });
  }
  function finish(ok, title, text, retry){
    clearInterval(pollT); clearInterval(tickT);
    try { sessionStorage.removeItem(KEY); } catch(e){}
    var ic = $('dIcon'); ic.textContent = ok ? '\\u2713' : '!'; ic.style.background = ok ? 'var(--ok)' : 'var(--bad)';
    $('dTitle').textContent = title; $('dText').textContent = text;
    $('retryBtn').classList.toggle('hide', !retry);
    show('done');
  }
  function tick(){
    var s = Math.max(0, Math.floor((new Date(order.expiresAt) - Date.now()) / 1000));
    $('pTimer').textContent = Math.floor(s/60) + ':' + ('0' + (s%60)).slice(-2);
  }
  function poll(){
    api('/orders/' + encodeURIComponent(order.orderId) + '/status').then(function(j){
      if (!j.success) return;
      if (j.data.status === 'paid') finish(true, 'Payment received', 'Rs. ' + j.data.payAmount + ' paid to ' + order.merchantName + '. You can close this page.', false);
      else if (j.data.status !== 'pending') finish(false, 'Payment expired', 'This payment window has closed. If you already paid, contact the merchant.', true);
    }).catch(function(){});
  }
  function showPay(){
    $('pMerchant').textContent = order.merchantName;
    $('pAmount').textContent = '\\u20B9' + order.payAmount;
    $('pQr').src = order.qrDataUrl;
    $('pUpi').textContent = order.upiId;
    $('pOrder').textContent = order.orderNumber;
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) { $('upiBtn').href = order.upiUri; $('upiBtn').classList.remove('hide'); }
    show('pay'); tick();
    tickT = setInterval(tick, 1000); pollT = setInterval(poll, 5000);
  }

  $('payBtn').onclick = function(){
    var b = $('payBtn'); b.disabled = true; $('iErr').textContent = '';
    api('/links/' + encodeURIComponent(slug) + '/orders', { method: 'POST' }).then(function(j){
      if (!j.success) { $('iErr').textContent = j.message || 'Could not start payment.'; b.disabled = false; return; }
      order = j.data;
      try { sessionStorage.setItem(KEY, JSON.stringify(order)); } catch(e){}
      showPay();
    }).catch(function(){ $('iErr').textContent = 'Network error. Try again.'; b.disabled = false; });
  };
  $('retryBtn').onclick = function(){ location.reload(); };

  function loadInfo(){
    api('/links/' + encodeURIComponent(slug)).then(function(j){
      if (!j.success) return finish(false, 'Link not found', j.message || 'This payment link does not exist.', false);
      var d = j.data;
      $('iMerchant').textContent = d.merchantName;
      $('iTitle').textContent = d.title;
      $('iDesc').textContent = d.description || '';
      $('iAmount').textContent = '\\u20B9' + d.amount;
      if (!d.payable) { $('payBtn').classList.add('hide'); $('iErr').textContent = d.reason; }
      show('info');
    }).catch(function(){ finish(false, 'Connection problem', 'Check your internet and reload.', false); });
  }

  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch(e){}
  if (saved && new Date(saved.expiresAt) > new Date()) {
    order = saved;
    api('/orders/' + encodeURIComponent(order.orderId) + '/status').then(function(j){
      if (j.success && j.data.status === 'pending') showPay();
      else if (j.success && j.data.status === 'paid') finish(true, 'Payment received', 'Rs. ' + j.data.payAmount + ' paid. You can close this page.', false);
      else { try { sessionStorage.removeItem(KEY); } catch(e){} loadInfo(); }
    }).catch(loadInfo);
  } else { loadInfo(); }
})();
</script></body></html>`;

router.get("/:slug", (_req, res) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.set({
    "Content-Security-Policy": [
      "default-src 'none'",
      `script-src 'nonce-${nonce}'`,
      `style-src 'nonce-${nonce}'`,
      "img-src data:",
      "connect-src 'self'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
    "Cache-Control": "no-store",
  });
  res.type("html").send(page(nonce));
});

module.exports = router;
