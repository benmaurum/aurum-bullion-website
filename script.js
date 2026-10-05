/* Aurum Bullion PLC - local global behaviour. No remote JavaScript dependency. */
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  ready(function(){
    /* Brand assets */
    document.querySelectorAll('.brand img, footer img, .brochure-top img').forEach(function(img){
      if(img.closest('.partner-card')) return;
      if(img.classList.contains('partner-logo')) return;
      if(img.closest('.footer-brand') || img.closest('.brand') || img.closest('.brochure-top')){
        img.src='Logo.png'; img.alt='Aurum Bullion PLC';
      }
    });

    /* Mobile navigation */
    document.querySelectorAll('.menu').forEach(function(menu){
      if(menu.dataset.aurumReady) return;
      menu.dataset.aurumReady='1';
      menu.setAttribute('type','button');
      menu.setAttribute('aria-label','Menu');
      menu.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        var header=menu.closest('header');
        var nav=header && header.querySelector('nav');
        if(nav) nav.classList.toggle('open');
      });
    });

    /* Keep catalogue controls above any global click handling. */
    document.querySelectorAll('.filters button,.sides button,.lightbox-sides button,.basket-open,.buy,.shop-sort,.search,#cartClose,#coinLightboxClose').forEach(function(el){
      el.style.pointerEvents='auto';
    });

    /* Homepage grading pair: NGC larger than PCGS. */
    var graded=document.querySelector('#graded .graded-feature');
    if(graded){
      graded.src='2021 Royal Albert Hall Five Pound Crown.png';
      graded.alt='2021 Royal Albert Hall Five Pound Crown, NGC PF70 Ultra Cameo';
      var slab=graded.closest('.slab');
      if(slab && !slab.querySelector('.pcgs-feature')){
        slab.classList.add('grading-pair');
        var pcgs=document.createElement('img');
        pcgs.className='graded-feature pcgs-feature';
        pcgs.src='King James Slab PCGS.png';
        pcgs.alt='2022 Great Britain King James I £500 5oz gold coin, PCGS PR69DCAM First Strike';
        slab.appendChild(pcgs);
      }
    }

    /* Homepage Ghana videos: preserve native seek/play controls. */
    document.querySelectorAll('[data-ghana-video]').forEach(function(v){
      v.controls=true;
      v.setAttribute('controls','');
      v.setAttribute('playsinline','');
      v.setAttribute('preload','metadata');
    });

    /* Cookie notice, deliberately non-blocking. */
    try{
      if(!localStorage.getItem('aurumCookieChoice')){
        var b=document.createElement('div');
        b.className='cookie-banner';
        b.innerHTML='<div><strong>Cookie choices</strong><p>Aurum uses necessary cookies for core site functions. Optional analytics or marketing technologies will only be activated with consent if introduced.</p></div><div><button type="button" data-cookie="necessary">Necessary only</button><button type="button" class="accept" data-cookie="all">Accept all</button><a href="cookies.html">Cookies Policy</a></div>';
        document.body.appendChild(b);
        b.querySelectorAll('[data-cookie]').forEach(function(x){x.addEventListener('click',function(){localStorage.setItem('aurumCookieChoice',x.dataset.cookie);b.remove();});});
      }
    }catch(e){}

    /* Live gold spot with resilient fallbacks. */
    var goldEl=document.getElementById('gold');
    var pairEl=document.getElementById('goldpair');
    var timeEl=document.getElementById('goldtime');
    var toggle=document.getElementById('currencyToggle');
    if(goldEl){
      var currency=(pairEl && pairEl.textContent.indexOf('USD')>=0)?'USD':'GBP';
      var usd=null,gbp=null,lastSuccess=0,busy=false;
      function jf(url,timeout){
        timeout=timeout||5500;
        var c=new AbortController(); var t=setTimeout(function(){c.abort();},timeout);
        return fetch(url,{cache:'no-store',signal:c.signal}).then(function(r){if(!r.ok) throw new Error(String(r.status)); return r.json();}).finally(function(){clearTimeout(t);});
      }
      async function goldUsd(){
        var feeds=[async function(){return Number((await jf('https://api.gold-api.com/price/XAU')).price);},async function(){var j=await jf('https://data-asg.goldprice.org/dbXRates/USD');return Number(j&&j.items&&j.items[0]&&j.items[0].xauPrice);}];
        for(var i=0;i<feeds.length;i++){try{var n=await feeds[i]();if(Number.isFinite(n)&&n>500)return n;}catch(e){}}
        throw new Error('gold feed unavailable');
      }
      async function usdGbp(){
        var feeds=[async function(){var j=await jf('https://api.frankfurter.app/latest?from=USD&to=GBP');return Number(j&&j.rates&&j.rates.GBP);},async function(){var j=await jf('https://open.er-api.com/v6/latest/USD');return Number(j&&j.rates&&j.rates.GBP);}];
        for(var i=0;i<feeds.length;i++){try{var n=await feeds[i]();if(Number.isFinite(n)&&n>.4&&n<1.5)return n;}catch(e){}}
        throw new Error('FX feed unavailable');
      }
      function renderGold(){
        if(currency==='USD'&&Number.isFinite(usd)){goldEl.textContent='$'+usd.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/USD';}
        else if(Number.isFinite(gbp)){goldEl.textContent='£'+gbp.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/GBP';}
      }
      function stamp(live){
        if(!timeEl)return;
        if(live&&lastSuccess)timeEl.textContent='• LIVE GOLD SPOT • UPDATED '+new Date(lastSuccess).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
        else if(lastSuccess)timeEl.textContent='• FEED RECONNECTING • LAST UPDATE '+new Date(lastSuccess).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
        else timeEl.textContent='• CONNECTING TO LIVE GOLD SPOT';
      }
      async function refreshGold(){
        if(busy)return; busy=true;
        try{var vals=await Promise.all([goldUsd(),usdGbp()]);usd=vals[0];gbp=vals[0]*vals[1];lastSuccess=Date.now();renderGold();stamp(true);}catch(e){renderGold();stamp(false);}finally{busy=false;}
      }
      if(toggle){toggle.addEventListener('click',function(e){e.preventDefault();currency=currency==='GBP'?'USD':'GBP';renderGold();});}
      refreshGold(); setInterval(refreshGold,30000);
      document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshGold();});
      window.addEventListener('focus',refreshGold);
    }
  });

  /* Styling injected locally so homepage grading pair remains balanced. */
  var s=document.createElement('style');
  s.textContent='header nav.open{display:flex!important}.grading-pair{display:flex!important;align-items:center!important;justify-content:center!important;gap:22px!important;padding:30px 18px!important;box-sizing:border-box!important}.grading-pair .graded-feature{display:block!important;width:auto!important;height:auto!important;object-fit:contain!important;mix-blend-mode:multiply}.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:570px!important}.grading-pair .pcgs-feature{max-width:40%!important;max-height:490px!important}@media(max-width:760px){.grading-pair{gap:8px!important;padding:22px 8px!important}.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:430px!important}.grading-pair .pcgs-feature{max-width:40%!important;max-height:365px!important}}';
  document.head.appendChild(s);
})();