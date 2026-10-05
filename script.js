/* Aurum Bullion PLC - local global behaviour. No remote JavaScript dependency. */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    /* Brand assets and favicon */
    document.querySelectorAll('.brand img, footer img, .brochure-top img').forEach(function(img){if(img.closest('.partner-card')||img.classList.contains('partner-logo'))return;if(img.closest('.footer-brand')||img.closest('.footer-brand-contact')||img.closest('.brand')||img.closest('.brochure-top')){img.src='Logo.png';img.alt='Aurum Bullion PLC';}});
    var fav=document.querySelector("link[rel~='icon']");if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav);}fav.type='image/png';fav.href='Logo.png';

    /* Navigation: Partners belongs beneath Why Aurum. */
    document.querySelectorAll('header nav').forEach(function(nav){var why=null,partners=null;Array.prototype.slice.call(nav.querySelectorAll('a')).forEach(function(el){if(el.textContent.trim()==='Why Aurum')why=el;if(el.textContent.trim()==='Partners')partners=el;if(el.textContent.trim()==='Gold Guide')el.textContent='Gold Coin Guide';});var parent=nav.querySelector('.nav-parent');if(!parent&&why){parent=document.createElement('span');parent.className='nav-parent';nav.insertBefore(parent,why);parent.appendChild(why);}if(parent&&partners&&!parent.contains(partners)){var submenu=parent.querySelector('.nav-submenu');if(!submenu){submenu=document.createElement('span');submenu.className='nav-submenu';parent.appendChild(submenu);}submenu.appendChild(partners);}});
    document.querySelectorAll('a').forEach(function(a){var t=a.textContent.trim();if(t==='Read the Aurum Gold Guide →')a.textContent='Read the Aurum Gold Coin Guide →';if(t==='Speak to a Gold Specialist')a.textContent='Speak to a Gold Coin Specialist';if(t==='Explore Gold')a.textContent='Explore Gold Coins';});

    /* Mobile navigation. */
    document.querySelectorAll('.menu').forEach(function(menu){if(menu.dataset.aurumReady)return;menu.dataset.aurumReady='1';menu.type='button';menu.setAttribute('aria-label','Menu');menu.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var nav=menu.closest('header')&&menu.closest('header').querySelector('nav');if(nav)nav.classList.toggle('open');});});

    /* Keep interactive catalogue controls clickable. */
    document.querySelectorAll('.filters button,.sides button,.lightbox-sides button,.basket-open,.buy,.shop-sort,.search,#cartClose,#coinLightboxClose').forEach(function(el){el.style.pointerEvents='auto';});

    /* Homepage grading pair: approved NGC image larger than PCGS. */
    var graded=document.querySelector('#graded .graded-feature');if(graded){graded.src='2021 Royal Albert Hall Five Pound Crown.png';graded.alt='2021 Royal Albert Hall Five Pound Crown, NGC PF70 Ultra Cameo';var slab=graded.closest('.slab');if(slab&&!slab.querySelector('.pcgs-feature')){slab.classList.add('grading-pair');var pcgs=document.createElement('img');pcgs.className='graded-feature pcgs-feature';pcgs.src='King James Slab PCGS.png';pcgs.alt='2022 Great Britain King James I £500 5oz gold coin, PCGS PR69DCAM First Strike';slab.appendChild(pcgs);}}

    /* Ghana field story. Soundtrack intentionally disabled until a local audio asset is supplied. */
    (function(){
      var frame=document.querySelector('.ghana-video-showcase'),media=document.querySelector('.ghana-media'),stills=document.querySelector('.ghana-stills');
      if(!frame||!media||!stills)return;
      var videos=Array.prototype.slice.call(frame.querySelectorAll('[data-ghana-video]'));
      if(!videos.length)return;
      frame.querySelectorAll('.ghana-sound-toggle').forEach(function(x){x.remove();});
      document.querySelectorAll('audio').forEach(function(a){if(/Babu|ghana/i.test(a.src||'')){a.pause();a.remove();}});
      media.classList.add('ghana-media-fixed');frame.classList.add('ghana-video-fixed');stills.classList.add('ghana-stills-fixed');
      videos.forEach(function(v,i){
        v.classList.add('ghana-clip-fixed');
        v.muted=true;v.defaultMuted=true;v.volume=0;v.controls=false;
        v.removeAttribute('controls');v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('preload','metadata');
        v.style.opacity=i===0?'1':'0';v.style.visibility=i===0?'visible':'hidden';v.style.zIndex=i===0?'2':'1';
        v.addEventListener('volumechange',function(){if(!v.muted||v.volume!==0){v.muted=true;v.volume=0;}});
      });
      var current=0;
      function show(i){
        current=(i+videos.length)%videos.length;
        videos.forEach(function(v,n){var active=n===current;v.style.opacity=active?'1':'0';v.style.visibility=active?'visible':'hidden';v.style.zIndex=active?'2':'1';if(!active){v.pause();try{v.currentTime=0;}catch(e){}}});
        videos[current].play().catch(function(){});
        frame.querySelectorAll('.ghana-video-progress span').forEach(function(d,n){d.style.opacity=n===current?'1':'.35';});
      }
      videos.forEach(function(v,i){v.addEventListener('ended',function(){show(i+1);});});
      show(0);
    })();

    /* Gold Guide: approved craftsmanship collage. */
    if(/brochure\.html$/i.test(location.pathname)){var masterpiece=document.querySelector('#p5 .page.dark img.photo');if(masterpiece){masterpiece.src='Mastering the Queen’s Beasts Coin.png';masterpiece.alt='Craftsmen working on the Queen’s Beasts gold coin';}}

    /* Master footer. */
    if(document.querySelector('footer')&&!document.querySelector('script[data-aurum-footer]')){var fs=document.createElement('script');fs.src='footer.js?v=20261005-3';fs.dataset.aurumFooter='1';document.body.appendChild(fs);}

    /* Cookie notice. */
    try{if(!localStorage.getItem('aurumCookieChoice')){var b=document.createElement('div');b.className='cookie-banner';b.innerHTML='<div><strong>Cookie choices</strong><p>Aurum uses necessary cookies for core site functions. Optional analytics or marketing technologies will only be activated with consent if introduced.</p></div><div><button type="button" data-cookie="necessary">Necessary only</button><button type="button" class="accept" data-cookie="all">Accept all</button><a href="cookies.html">Cookies Policy</a></div>';document.body.appendChild(b);b.querySelectorAll('[data-cookie]').forEach(function(x){x.addEventListener('click',function(){localStorage.setItem('aurumCookieChoice',x.dataset.cookie);b.remove();});});}}catch(e){}

    /* Live gold spot with resilient fallbacks and stale-state labelling. */
    var goldEl=document.getElementById('gold'),pairEl=document.getElementById('goldpair'),timeEl=document.getElementById('goldtime'),toggle=document.getElementById('currencyToggle');if(goldEl){var currency=(pairEl&&pairEl.textContent.indexOf('USD')>=0)?'USD':'GBP',usd=null,gbp=null,lastSuccess=0,busy=false;function jf(url,timeout){timeout=timeout||5500;var c=new AbortController(),t=setTimeout(function(){c.abort();},timeout);return fetch(url,{cache:'no-store',signal:c.signal}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json();}).finally(function(){clearTimeout(t);});}async function goldUsd(){var feeds=[async function(){return Number((await jf('https://api.gold-api.com/price/XAU')).price);},async function(){var j=await jf('https://data-asg.goldprice.org/dbXRates/USD');return Number(j&&j.items&&j.items[0]&&j.items[0].xauPrice);}];for(var i=0;i<feeds.length;i++){try{var n=await feeds[i]();if(Number.isFinite(n)&&n>500)return n;}catch(e){}}throw new Error('gold feed unavailable');}async function usdGbp(){var feeds=[async function(){var j=await jf('https://api.frankfurter.app/latest?from=USD&to=GBP');return Number(j&&j.rates&&j.rates.GBP);},async function(){var j=await jf('https://open.er-api.com/v6/latest/USD');return Number(j&&j.rates&&j.rates.GBP);}];for(var i=0;i<feeds.length;i++){try{var n=await feeds[i]();if(Number.isFinite(n)&&n>.4&&n<1.5)return n;}catch(e){}}throw new Error('FX feed unavailable');}function renderGold(){if(currency==='USD'&&Number.isFinite(usd)){goldEl.textContent='$'+usd.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/USD';}else if(Number.isFinite(gbp)){goldEl.textContent='£'+gbp.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/GBP';}}function stamp(live){if(!timeEl)return;if(live&&lastSuccess)timeEl.textContent='• LIVE GOLD SPOT • UPDATED '+new Date(lastSuccess).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});else if(lastSuccess)timeEl.textContent='• FEED RECONNECTING • LAST UPDATE '+new Date(lastSuccess).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});else timeEl.textContent='• CONNECTING TO LIVE GOLD SPOT';}async function refreshGold(){if(busy)return;busy=true;try{var vals=await Promise.all([goldUsd(),usdGbp()]);usd=vals[0];gbp=vals[0]*vals[1];lastSuccess=Date.now();renderGold();stamp(true);}catch(e){renderGold();stamp(false);}finally{busy=false;}}if(toggle&&!toggle.dataset.liveGoldReady){toggle.dataset.liveGoldReady='1';toggle.addEventListener('click',function(e){e.preventDefault();currency=currency==='GBP'?'USD':'GBP';renderGold();});}refreshGold();setInterval(refreshGold,30000);setInterval(function(){if(lastSuccess&&Date.now()-lastSuccess>90000)stamp(false);},10000);document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshGold();});window.addEventListener('focus',refreshGold);}
  });

  var s=document.createElement('style');
  s.textContent='header nav.open{display:flex!important}.nav-parent{position:relative;display:inline-flex;align-items:center}.nav-parent>a{display:block}.nav-submenu{display:none;position:absolute;top:72px;left:-18px;min-width:150px;background:#fff;border:1px solid #d9dde0;box-shadow:0 10px 25px rgba(0,0,0,.10);z-index:60;padding:6px 0}.nav-parent:hover .nav-submenu,.nav-parent:focus-within .nav-submenu{display:block}.nav-submenu a{display:block!important;padding:12px 18px!important;border-bottom:0!important;white-space:nowrap}.ghana-media-fixed{display:grid!important;grid-template-columns:1.15fr .85fr!important;gap:10px!important;align-items:stretch!important;margin:38px 0 55px!important}.ghana-video-fixed,.ghana-stills-fixed{height:420px!important;min-height:420px!important;max-height:420px!important;margin:0!important;padding:0!important;align-self:stretch!important;overflow:hidden!important;border:0!important}.ghana-video-fixed{position:relative!important;width:100%!important;background:transparent!important;aspect-ratio:auto!important}.ghana-stills-fixed{display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:1fr 1fr!important;gap:8px!important}.ghana-stills-fixed img{display:block!important;width:100%!important;height:100%!important;min-height:0!important;margin:0!important;object-fit:cover!important}.ghana-video-fixed .ghana-clip-fixed{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center center!important;background:transparent!important;border:0!important;margin:0!important;padding:0!important}.grading-pair{display:flex!important;align-items:center!important;justify-content:center!important;gap:22px!important;padding:30px 18px!important;box-sizing:border-box!important}.grading-pair .graded-feature{display:block!important;width:auto!important;height:auto!important;object-fit:contain!important;mix-blend-mode:multiply}.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:570px!important}.grading-pair .pcgs-feature{max-width:40%!important;max-height:490px!important}@media(max-width:1080px){.ghana-media-fixed{grid-template-columns:1fr!important}.ghana-video-fixed,.ghana-stills-fixed{height:min(62vw,420px)!important;min-height:280px!important;max-height:420px!important}}@media(max-width:1000px){header{flex-wrap:wrap!important;height:auto!important;min-height:94px!important}header nav.open{order:4!important;width:100%!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:8px 0 16px!important}.nav-parent{display:block!important;width:100%}.nav-parent .nav-submenu{position:static!important;display:block!important;box-shadow:none!important;border:0!important;padding:0 0 0 18px!important;background:transparent!important}.nav-submenu a{padding:8px 0!important}}@media(max-width:760px){.grading-pair{gap:8px!important;padding:22px 8px!important}.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:430px!important}.grading-pair .pcgs-feature{max-width:40%!important;max-height:365px!important}}';
  document.head.appendChild(s);
})();