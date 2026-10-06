/* Aurum Bullion PLC - site-wide news headline ticker. */
(function(){
  'use strict';
  function init(){
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
    fetch('news.json?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(data){
      var stories=(data.stories||[]).sort(function(a,b){return new Date(b.published_at)-new Date(a.published_at);}).slice(0,12);
      if(!stories.length)throw new Error('empty');
      var items=stories.map(function(s,i){return '<a href="insights.html#'+slug(s.headline,i)+'" title="Read this story">'+esc(s.headline)+'</a>';}).join('');
      bar.querySelector('.ticker-track').innerHTML=items+items;
    }).catch(function(){bar.querySelector('.ticker-track').innerHTML='<a href="insights.html">Latest gold coin, bullion and numismatic news</a><a href="insights.html">Latest gold coin, bullion and numismatic news</a>';});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();