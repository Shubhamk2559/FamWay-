const crypto = require("crypto");
const router = require("express").Router();

const page = (nonce) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#2563eb">
<title>Checkout | FamWay</title>
<style nonce="${nonce}">
:root{--ink:#0f172a;--muted:#64748b;--blue:#2563eb;--blue-d:#1d4ed8;--line:#e2e8f0;--ok:#16a34a;--bad:#dc2626;--font:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{background:#f0f4f8}
body{font-family:var(--font);color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0;opacity:.4;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(96,165,250,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.4) 1px,transparent 1px);background-size:64px 64px}
.hide{display:none!important}

.product{background:#eff6ff;border:1px solid #93c5fd;box-shadow:18px 19px 0 #60a5fa;position:relative;max-width:440px;width:100%;border-radius:12px;animation:popIn .5s cubic-bezier(.2,.8,.2,1) forwards}
.product-main{padding:28px}
.gateway-brand{display:flex;align-items:center;gap:10px;margin-bottom:24px}
.mark{width:28px;height:28px;border-radius:8px;background:var(--blue);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px}
.brand-name{font-weight:800;font-size:18px;letter-spacing:-.4px;color:var(--ink)}

.product-label{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.money{margin:0 0 24px;font-size:46px;letter-spacing:-1.5px;font-weight:800;color:var(--ink);line-height:1;word-break:break-all}
.money small{color:var(--muted);font-size:16px;letter-spacing:0;font-weight:600;margin-left:4px}

.pay-card{background:#fff;border:1px solid #dbeafe;padding:20px;border-radius:16px;margin-bottom:24px;box-shadow:0 4px 12px rgba(37,99,235,.04)}
.note{background:#fef9c3;color:#a16207;border:1px solid #fde68a;border-radius:10px;padding:9px 12px;font-size:12.5px;font-weight:600;margin:-8px 0 16px}

.pay-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid var(--line);font-size:13px;gap:8px}
.rows .pay-row:first-child{border-top:0;padding-top:0}
.pay-row>span:first-child{color:var(--muted);font-weight:500;white-space:nowrap;flex-shrink:0}
.pay-row b{color:var(--ink);font-weight:600;font-size:13px;text-align:right;word-break:break-all}
.pay-row b.cap{text-transform:capitalize}
.low{color:var(--bad)!important}

.qr-container{text-align:center;margin-bottom:16px}
.qr-box-wrap{position:relative;width:170px;height:170px;margin:0 auto;border-radius:12px;overflow:hidden;background:#f8fafc}
.qr-skeleton{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f1f5f9;border:1px solid var(--line);border-radius:12px;z-index:1;transition:opacity .25s ease-out;pointer-events:none}
.qr-skel-icon{width:32px;height:32px;color:#94a3b8;opacity:.8;animation:pulseIcon 1.5s infinite}
.qr-image{width:170px;height:170px;border-radius:12px;border:1px solid var(--line);padding:8px;background:#fff;display:block;margin:0 auto;position:relative;z-index:2;opacity:0;transition:opacity .25s ease-in-out}
.qr-box-wrap.loaded .qr-image{opacity:1}
.qr-box-wrap.loaded .qr-skeleton{opacity:0}
.qr-note{font-size:11px;font-weight:600;color:var(--muted);margin-top:12px;text-transform:uppercase;letter-spacing:.5px}

.btn{display:block;width:100%;padding:14px;border:0;border-radius:12px;background:var(--blue);color:#fff;font-family:inherit;font-size:15px;font-weight:700;text-align:center;text-decoration:none;cursor:pointer;margin-top:14px}
.btn:hover{background:var(--blue-d)}
.btn:disabled{opacity:.6;cursor:default}
.btn-soft{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#eff6ff;color:var(--blue);border:1px solid #bfdbfe;border-radius:8px;padding:7px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.btn-soft svg{width:14px;height:14px}
.err{color:var(--bad);font-size:13px;font-weight:600;margin-top:10px;text-align:center}
.err:empty{display:none}

.status{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--blue-d);background:#eff6ff;padding:5px 10px;border-radius:999px;border:1px solid #bfdbfe;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}
.spinner-pulse{width:8px;height:8px;min-width:8px;background:#3b82f6;border-radius:50%;animation:pulse 1.5s infinite}

.small{color:var(--muted);font-size:13px;text-align:center;padding:20px 0}
.success-container{position:relative;text-align:center;padding:20px 0 6px}
.icon{width:68px;height:68px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-size:32px;font-weight:700;color:#fff;animation:popScale .4s cubic-bezier(.2,.8,.2,1) forwards}
.icon.ok{background:var(--ok)}
.icon.bad{background:var(--bad)}
.success-container h1{font-size:20px;letter-spacing:-.3px}
.desc{color:var(--muted);font-size:13.5px;margin-top:6px}
.confetti{position:absolute;left:50%;top:54px;width:0;height:0;pointer-events:none}
.confetti i{position:absolute;width:7px;height:7px;border-radius:2px;animation:popConfetti 1.2s ease-out forwards}

.checkout-footer{display:flex;align-items:center;justify-content:center;gap:6px;color:var(--muted);font-size:11.5px;font-weight:500;letter-spacing:.2px;margin-top:-6px}
.checkout-footer svg{width:12px;height:12px;color:var(--blue)}
.checkout-footer b{color:var(--ink);font-weight:700}

@keyframes popIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes popScale{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(59,130,246,.7)}70%{transform:scale(1);box-shadow:0 0 0 6px rgba(59,130,246,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(59,130,246,0)}}
@keyframes pulseIcon{0%,100%{opacity:.5}50%{opacity:.9}}
@keyframes popConfetti{0%{opacity:1;transform:translate(0,0) scale(.5)}80%{opacity:1;transform:translate(var(--tx),var(--ty)) scale(1)}100%{opacity:0;transform:translate(var(--tx),calc(var(--ty) + 20px)) scale(.8)}}

@media (max-width:500px){
  body{padding:12px;padding-top:20px;align-items:flex-start;min-height:auto}
  .product{box-shadow:6px 6px 0 #60a5fa;margin:0 auto 20px}
  .product-main{padding:18px 16px}
  .money{font-size:36px;margin-bottom:18px}
  .pay-card{padding:16px}
  .qr-box-wrap,.qr-image{width:150px;height:150px}
  .pay-row{padding:10px 0;font-size:12.5px}
  .status{font-size:11.5px;padding:5px 9px;max-width:160px}
}
@media (prefers-reduced-motion:reduce){
  .product,.icon,.spinner-pulse,.qr-skel-icon{animation:none}
}
</style></head><body>
<main class="product">
<div class="product-main">
  <div class="gateway-brand"><span class="mark">F</span><span class="brand-name">FamWay</span></div>

  <section id="loading"><p class="small">Loading...</p></section>

  <section id="info" class="hide">
    <div class="product-label">Order total</div>
    <div class="money" id="iAmount"></div>
    <div class="pay-card">
      <div class="rows">
        <div class="pay-row"><span>Merchant</span><b class="cap" id="iMerchant"></b></div>
        <div class="pay-row"><span>For</span><b id="iTitle"></b></div>
        <div class="pay-row hide" id="iDescRow"><span>Note</span><b id="iDesc"></b></div>
      </div>
      <button type="button" class="btn" id="payBtn">Pay now</button>
      <p class="err" id="iErr"></p>
    </div>
  </section>

  <section id="pay" class="hide">
    <div class="product-label">Order total</div>
    <div class="money" id="pAmount"></div>
    <div class="note">Pay exactly this amount, including paise. Do not change it.</div>
    <div class="pay-card">
      <div class="qr-container">
        <div class="qr-box-wrap" id="qrWrap">
          <div class="qr-skeleton">
            <svg class="qr-skel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
              <path d="M14 14h3v3h-3z"></path><path d="M20 14v3"></path><path d="M14 20h3"></path><path d="M20 20h.01"></path>
            </svg>
          </div>
          <img class="qr-image" id="pQr" alt="UPI QR code">
        </div>
        <div class="qr-note">Scan with any UPI app</div>
        <a class="btn hide" id="upiBtn">Open UPI app</a>
        <button type="button" class="btn-soft" id="saveBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Save QR
        </button>
      </div>
      <div class="rows">
        <div class="pay-row"><span>Merchant</span><b class="cap" id="pMerchant"></b></div>
        <div class="pay-row"><span>Pay to</span><b id="pUpi"></b></div>
        <div class="pay-row"><span>Order ID</span><b id="pOrder"></b></div>
        <div class="pay-row"><span>Expires in</span><b id="pTimer"></b></div>
        <div class="pay-row"><span>Verification</span>
          <span class="status" role="status"><span class="spinner-pulse"></span><span>Waiting for payment...</span></span>
        </div>
      </div>
    </div>
  </section>

  <section id="done" class="hide">
    <div class="success-container">
      <div class="confetti" id="confetti"></div>
      <div class="icon ok" id="dIcon"></div>
      <h1 id="dTitle"></h1>
      <p class="desc" id="dText"></p>
      <button type="button" class="btn hide" id="retryBtn">Start again</button>
    </div>
  </section>

  <div class="checkout-footer">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    <span>Secured by <b>FamWay</b></span>
  </div>
</div>
</main>

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
  function money(el, v){
    el.textContent = '\\u20B9 ' + v + ' ';
    var s = document.createElement('small'); s.textContent = 'INR'; el.appendChild(s);
  }
  function fmt(s){
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + x).slice(-2);
  }
  function confetti(){
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = $('confetti'), colors = ['#2563eb','#60a5fa','#16a34a','#f59e0b','#ef4444'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('i');
      var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
      p.style.setProperty('--tx', (Math.cos(a) * d) + 'px');
      p.style.setProperty('--ty', (Math.sin(a) * d - 30) + 'px');
      p.style.background = colors[i % colors.length];
      box.appendChild(p);
    }
    setTimeout(function(){ box.textContent = ''; }, 1600);
  }
  function finish(ok, title, text, retry){
    clearInterval(pollT); clearInterval(tickT);
    try { sessionStorage.removeItem(KEY); } catch(e){}
    var ic = $('dIcon');
    ic.textContent = ok ? '\\u2713' : '!';
    ic.classList.toggle('ok', ok);
    ic.classList.toggle('bad', !ok);
    $('dTitle').textContent = title; $('dText').textContent = text;
    $('retryBtn').classList.toggle('hide', !retry);
    show('done');
    if (ok) confetti();
  }
  function tick(){
    var s = Math.max(0, Math.floor((new Date(order.expiresAt) - Date.now()) / 1000));
    $('pTimer').textContent = fmt(s);
    $('pTimer').classList.toggle('low', s < 60);
  }
  function poll(){
    api('/orders/' + encodeURIComponent(order.orderId) + '/status').then(function(j){
      if (!j.success) return;
      if (j.data.status === 'paid') finish(true, 'Payment received', 'Rs. ' + j.data.payAmount + ' paid to ' + order.merchantName + '. You can close this page.', false);
      else if (j.data.status !== 'pending') finish(false, 'Payment expired', 'This payment window has closed. If you already paid, contact the merchant.', true);
    }).catch(function(){});
  }
  function showPay(){
    money($('pAmount'), order.payAmount);
    $('pMerchant').textContent = order.merchantName;
    $('pUpi').textContent = order.upiId;
    $('pOrder').textContent = order.orderNumber;
    var wrap = $('qrWrap'), img = $('pQr');
    wrap.classList.remove('loaded');
    img.onload = function(){ wrap.classList.add('loaded'); };
    img.src = order.qrDataUrl;
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) { $('upiBtn').href = order.upiUri; $('upiBtn').classList.remove('hide'); }
    show('pay'); tick();
    tickT = setInterval(tick, 1000); pollT = setInterval(poll, 5000);
  }

  $('saveBtn').onclick = function(){
    if (!order) return;
    var a = document.createElement('a');
    a.href = order.qrDataUrl; a.download = 'famway-' + order.orderNumber + '.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

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
      money($('iAmount'), d.amount);
      $('iMerchant').textContent = d.merchantName;
      $('iTitle').textContent = d.title;
      if (d.description) { $('iDesc').textContent = d.description; $('iDescRow').classList.remove('hide'); }
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
