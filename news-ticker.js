/* Aurum Bullion PLC - site-wide news headline ticker. */
(function(){
  'use strict';
  function fixTudor(){
    var card=document.querySelector('.collections .curated-coin-card:nth-child(2)');
    if(!card)return;
    var img=card.querySelector('.curated-image-box img');
    if(img){img.src='Remove background project - 06 October 2026 at 20.10.25.png';img.alt='2023 Royal Tudor Beasts Yale of Beaufort PCGS MS69 gold coin';}
    if(!document.getElementById('tudor-yale-fix')){
      var s=document.createElement('style');s.id='tudor-yale-fix';
      s.textContent='.collections .curated-coin-card:nth-child(2) .visual{overflow:hidden!important}.collections .curated-coin-card:nth-child(2) .curated-image-box{height:260px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important}.collections .curated-coin-card:nth-child(2) .curated-image-box img{display:block!important;height:250px!important;min-height:250px!important;max-height:250px!important;width:auto!important;max-width:100%!important;object-fit:contain!important;object-position:center center!important;position:static!important;top:auto!important;margin:auto!important;transform:none!important;scale:1!important}@media(max-width:1050px){.collections .curated-coin-card:nth-child(2) .curated-image-box{height:215px!important}.collections .curated-coin-card:nth-child(2) .curated-image-box img{height:205px!important;min-height:205px!important;max-height:205px!important}}@media(max-width:520px){.collections .curated-coin-card:nth-child(2) .curated-image-box{height:255px!important}.collections .curated-coin-card:nth-child(2) .curated-image-box img{height:245px!important;min-height:245px!important;max-height:245px!important}}';
      document.head.appendChild(s);
    }
  }
  /* Catalogue rule: the artwork/design face is ALWAYS the default. For the original numbered archive the plain N. file is the design and N.2 is the portrait. Explicit _Reverse/_Obverse files use their names. */
  function fixCatalogueDesign(){
    var products=document.getElementById('products');
    if(!products)return;
    products.querySelectorAll('.visual').forEach(function(v){
      var img=v.querySelector('img'),buttons=[].slice.call(v.querySelectorAll('.sides button'));
      if(!img||buttons.length<2)return;
      var sources=buttons.map(function(b){return decodeURI(b.dataset.src||'');}).filter(Boolean);
      if(sources.length<2)return;
      var design=sources.find(function(src){return /_reverse\b/i.test(src);});
      var portrait=sources.find(function(src){return /_obverse\b/i.test(src);});
      if(!design){design=sources.find(function(src){return /(^|\/)\d+\.\s/.test(src);});}
      if(!portrait){portrait=sources.find(function(src){return /(^|\/)\d+\.2\s/.test(src);});}
      if(!design)design=sources[0];
      if(!portrait)portrait=sources.find(function(src){return src!==design;})||sources[1];
      function show(src,label,index){
        img.src=encodeURI(src);img.alt=label+' view of '+(img.dataset.name||'coin');
        buttons.forEach(function(b,i){b.classList.toggle('active',i===index);});
        v.dataset.active=String(index);
      }
      buttons[0].dataset.src=design;buttons[0].dataset.label='Reverse';buttons[0].textContent='Design';
      buttons[1].dataset.src=portrait;buttons[1].dataset.label='Obverse';buttons[1].textContent='Portrait';
      show(design,'Design / reverse',0);
      if(v.dataset.aurumDesignHover!=='1'){
        v.dataset.aurumDesignHover='1';
        v.addEventListener('mouseenter',function(){show(buttons[1].dataset.src,'Portrait / obverse',1);});
        v.addEventListener('mouseleave',function(){show(buttons[0].dataset.src,'Design / reverse',0);});
      }
    });
  }
  function init(){
    fixTudor();setTimeout(fixTudor,500);setTimeout(fixTudor,1400);
    fixCatalogueDesign();setTimeout(fixCatalogueDesign,250);setTimeout(fixCatalogueDesign,800);setTimeout(fixCatalogueDesign,1700);
    var products=document.getElementById('products');if(products)new MutationObserver(function(){setTimeout(fixCatalogueDesign,0);}).observe(products,{childList:true,subtree:true});
    if(document.querySelector('.aurum-news-ticker'))return;
    var market=document.querySelector('.market');
    if(!market)return;
    var bar=document.createElement('div');
    bar.className='aurum-news-ticker';
    bar.setAttribute('aria-label','Latest gold and numismatic news headlines');
    bar.innerHTML='<a class="ticker-label" href="insights.html"><span class="breaking-dot" aria-hidden="true"></span><span class="ticker-label-wide">BREAKING NEWS</span><span class="ticker-label-short">NEWS</span></a><div class="ticker-window"><div class="ticker-track"><a href="insights.html">Loading latest gold and numismatic headlines…</a></div></div>';
    market.insertAdjacentElement('afterend',bar);
    var style=document.createElement('style');
    style.textContent='.aurum-news-ticker{height:36px;display:flex;align-items:stretch;width:100%;background:#f3f6f8;color:#3f474c;border-top:1px solid #d9dee1;border-bottom:1px solid #c8cfd3;overflow:hidden;position:relative;z-index:49;box-shadow:0 2px 7px rgba(35,43,48,.06)}.ticker-label{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:0 18px;background:#a8c8e0;color:#26343c!important;font:700 10px/1 Arial,sans-serif;letter-spacing:1.15px;text-decoration:none;border-right:1px solid #91b4cf}.breaking-dot{width:7px;height:7px;border-radius:50%;background:#b32025;box-shadow:0 0 0 3px rgba(179,32,37,.10);animation:aurumNewsPulse 1.8s ease-in-out infinite}.ticker-label-short{display:none}.ticker-window{position:relative;overflow:hidden;flex:1;display:flex;align-items:center}.ticker-track{display:flex;align-items:center;gap:0;width:max-content;white-space:nowrap;animation:aurumTicker 105s linear infinite;will-change:transform}.ticker-track:hover{animation-play-state:paused}.ticker-track a{display:inline-flex;align-items:center;color:#4a4a4a!important;text-decoration:none;font:500 11px/36px Arial,sans-serif;letter-spacing:.25px;padding:0 27px}.ticker-track a:after{content:"◆";font-size:6px;color:#d4af37;margin-left:27px}.ticker-track a:hover{color:#8b6d20!important;text-decoration:underline}.aurum-news-ticker:focus-within .ticker-track{animation-play-state:paused}@keyframes aurumTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes aurumNewsPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.82)}}@media(prefers-reduced-motion:reduce){.ticker-track{animation:none;overflow-x:auto}.breaking-dot{animation:none}}@media(max-width:650px){.aurum-news-ticker{height:32px}.ticker-label{padding:0 11px;font-size:8px}.ticker-label-wide{display:none}.ticker-label-short{display:inline}.ticker-track a{font-size:10px;line-height:32px;padding:0 18px}}';
    document.head.appendChild(style);
    function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function slug(s,i){return 'story-'+String(s||'headline').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)+'-'+i;}
    fetch('https://raw.githubusercontent.com/benmaurum/aurum-bullion-website/main/news.json',{cache:'no-store',signal:AbortSignal.timeout(8000)}).then(r=>{if(!r.ok)throw new Error('Remote news unavailable');return r;}).catch(()=>fetch('news.json?ts='+Date.now(),{cache:'no-store'})).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(data){
      var stories=(data.stories||[]).sort(function(a,b){return new Date(b.published_at)-new Date(a.published_at);}).slice(0,12);
      if(!stories.length)throw new Error('empty');
      var items=stories.map(function(s,i){return '<a href="insights.html#'+slug(s.headline,i)+'" title="Read this story">'+esc(s.headline)+'</a>';}).join('');
      bar.querySelector('.ticker-track').innerHTML=items+items;
    }).catch(function(){bar.querySelector('.ticker-track').innerHTML='<a href="insights.html">Latest gold coin, bullion and numismatic news</a><a href="insights.html">Latest gold coin, bullion and numismatic news</a>';});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();