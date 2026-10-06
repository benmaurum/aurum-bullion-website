/* Aurum Bullion PLC - site-wide Insights headline ticker. */
(function(){
  'use strict';
  function init(){
    if(document.querySelector('.aurum-news-ticker'))return;
    var market=document.querySelector('.market');
    if(!market)return;
    var bar=document.createElement('div');
    bar.className='aurum-news-ticker';
    bar.setAttribute('aria-label','Latest Aurum Insights headlines');
    bar.innerHTML='<a class="ticker-label" href="insights.html">AURUM INSIGHTS</a><div class="ticker-window"><div class="ticker-track"><a href="insights.html">Loading latest gold and numismatic headlines…</a></div></div>';
    market.insertAdjacentElement('afterend',bar);
    var style=document.createElement('style');
    style.textContent='.aurum-news-ticker{height:34px;display:flex;align-items:stretch;width:100%;background:#252a2d;color:#fff;border-top:1px solid rgba(212,175,55,.35);border-bottom:1px solid rgba(212,175,55,.55);overflow:hidden;position:relative;z-index:49}.ticker-label{flex:0 0 auto;display:flex;align-items:center;padding:0 18px;background:#d4af37;color:#252a2d!important;font:700 10px/1 Arial,sans-serif;letter-spacing:1.2px;text-decoration:none}.ticker-window{position:relative;overflow:hidden;flex:1;display:flex;align-items:center}.ticker-track{display:flex;align-items:center;gap:0;width:max-content;white-space:nowrap;animation:aurumTicker 105s linear infinite;will-change:transform}.ticker-track:hover{animation-play-state:paused}.ticker-track a{display:inline-flex;align-items:center;color:#fff!important;text-decoration:none;font:500 11px/34px Arial,sans-serif;letter-spacing:.25px;padding:0 26px}.ticker-track a:after{content:"◆";font-size:6px;color:#d4af37;margin-left:26px}.ticker-track a:hover{color:#d4af37!important;text-decoration:underline}.aurum-news-ticker:focus-within .ticker-track{animation-play-state:paused}@keyframes aurumTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.ticker-track{animation:none;overflow-x:auto}}@media(max-width:650px){.aurum-news-ticker{height:32px}.ticker-label{padding:0 10px;font-size:8px}.ticker-track a{font-size:10px;line-height:32px;padding:0 18px}}';
    document.head.appendChild(style);
    function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function slug(s,i){return 'story-'+String(s||'headline').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)+'-'+i;}
    fetch('news.json?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(data){
      var stories=(data.stories||[]).sort(function(a,b){return new Date(b.published_at)-new Date(a.published_at);}).slice(0,12);
      if(!stories.length)throw new Error('empty');
      var items=stories.map(function(s,i){return '<a href="insights.html#'+slug(s.headline,i)+'" title="Open this story in Aurum Insights">'+esc(s.headline)+'</a>';}).join('');
      bar.querySelector('.ticker-track').innerHTML=items+items;
    }).catch(function(){bar.querySelector('.ticker-track').innerHTML='<a href="insights.html">Visit Aurum Insights for the latest gold, coin and numismatic intelligence</a><a href="insights.html">Visit Aurum Insights for the latest gold, coin and numismatic intelligence</a>';});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();