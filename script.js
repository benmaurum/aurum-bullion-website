/* Aurum Bullion global loader. The pinned core preserves the current site behaviour while footer.js supplies the single master footer across every page. */
(function(){
  const core=document.createElement('script');
  core.src='https://cdn.jsdelivr.net/gh/benmaurum/aurum-bullion-website@896b0e2d13a05caed33d511d750109fc60362d04/script.js';
  core.onload=function(){
    /* Current-site patch: keep the pinned behaviour, then apply the latest homepage media updates safely. */
    const graded=document.querySelector('#graded .graded-feature');
    if(graded){
      graded.src='2021 Royal Albert Hall Five Pound Crown.png';
      graded.alt='2021 Royal Albert Hall Five Pound Crown, NGC PF70 Ultra Cameo';
      const slab=graded.closest('.slab');
      if(slab&&!slab.querySelector('.pcgs-feature')){
        slab.classList.add('grading-pair');
        const pcgs=document.createElement('img');
        pcgs.className='graded-feature pcgs-feature';
        pcgs.src='King James Slab PCGS.png';
        pcgs.alt='2022 Great Britain King James I £500 5oz gold coin, PCGS PR69DCAM First Strike';
        slab.appendChild(pcgs);
        const style=document.createElement('style');
        style.textContent=`#graded .slab.grading-pair{display:flex!important;align-items:center!important;justify-content:center!important;gap:22px!important;padding:30px 18px!important;box-sizing:border-box!important}#graded .slab.grading-pair .graded-feature{display:block!important;width:auto!important;height:auto!important;object-fit:contain!important;mix-blend-mode:multiply}#graded .slab.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:570px!important}#graded .slab.grading-pair .pcgs-feature{max-width:40%!important;max-height:490px!important}@media(max-width:760px){#graded .slab.grading-pair{gap:8px!important;padding:22px 8px!important}#graded .slab.grading-pair .graded-feature:not(.pcgs-feature){max-width:52%!important;max-height:430px!important}#graded .slab.grading-pair .pcgs-feature{max-width:40%!important;max-height:365px!important}}`;
        document.head.appendChild(style);
      }
    }

    const frame=document.querySelector('.ghana-video-showcase');
    if(frame){
      const latest='WhatsApp Video 2026-10-05 at 14.34.47.mp4';
      let videos=[...frame.querySelectorAll('[data-ghana-video]')];
      if(!videos.some(v=>v.querySelector('source')?.getAttribute('src')===latest)){
        const v=document.createElement('video');
        v.muted=true;
        v.defaultMuted=true;
        v.setAttribute('muted','');
        v.setAttribute('playsinline','');
        v.setAttribute('preload','metadata');
        v.setAttribute('data-ghana-video','');
        const source=document.createElement('source');
        source.src=latest;
        source.type='video/mp4';
        v.appendChild(source);
        const progress=frame.querySelector('.ghana-video-progress');
        frame.insertBefore(v,progress||null);
        if(progress)progress.appendChild(document.createElement('span'));
        videos=[...frame.querySelectorAll('[data-ghana-video]')];
      }

      videos.forEach(v=>{
        v.setAttribute('controls','');
        v.controls=true;
        v.setAttribute('controlsList','nodownload');
      });

      const newest=videos.find(v=>v.querySelector('source')?.getAttribute('src')===latest);
      if(newest&&!newest.dataset.aurumCycleReady){
        newest.dataset.aurumCycleReady='1';
        newest.addEventListener('ended',()=>{
          const all=[...frame.querySelectorAll('[data-ghana-video]')];
          const idx=all.indexOf(newest);
          const next=all[(idx+1)%all.length];
          all.forEach(v=>{v.style.opacity=v===next?'1':'0';v.style.visibility=v===next?'visible':'hidden';if(v!==next)v.pause()});
          next?.play().catch(()=>{});
        });
      }
    }

    /* Live gold spot: override the older 120-second display with a faster resilient feed.
       Two gold sources and two FX sources are tried on every refresh. Never label stale data as live. */
    (function installLiveGold(){
      const goldEl=document.getElementById('gold');
      const pairEl=document.getElementById('goldpair');
      const timeEl=document.getElementById('goldtime');
      const toggle=document.getElementById('currencyToggle');
      if(!goldEl)return;
      let currency=(pairEl&&pairEl.textContent.includes('USD'))?'USD':'GBP';
      let usd=null,gbp=null,lastSuccess=0,busy=false;
      async function jf(url,timeout=5500){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{cache:'no-store',signal:c.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(t)}}
      async function goldUsd(){for(const f of [async()=>Number((await jf('https://api.gold-api.com/price/XAU')).price),async()=>Number((await jf('https://data-asg.goldprice.org/dbXRates/USD'))?.items?.[0]?.xauPrice)]){try{const n=await f();if(Number.isFinite(n)&&n>500)return n}catch(e){}}throw Error('gold feed unavailable')}
      async function usdGbp(){for(const f of [async()=>Number((await jf('https://api.frankfurter.app/latest?from=USD&to=GBP'))?.rates?.GBP),async()=>Number((await jf('https://open.er-api.com/v6/latest/USD'))?.rates?.GBP)]){try{const n=await f();if(Number.isFinite(n)&&n>.4&&n<1.5)return n}catch(e){}}throw Error('FX feed unavailable')}
      function render(){if(currency==='USD'&&Number.isFinite(usd)){goldEl.textContent='$'+usd.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/USD'}else if(Number.isFinite(gbp)){goldEl.textContent='£'+gbp.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pairEl)pairEl.textContent='XAU/GBP'}}
      function stamp(live){if(!timeEl)return;if(live&&lastSuccess){const d=new Date(lastSuccess);timeEl.textContent='• LIVE GOLD SPOT • UPDATED '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}else if(lastSuccess){timeEl.textContent='• FEED RECONNECTING • LAST UPDATE '+new Date(lastSuccess).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}else timeEl.textContent='• CONNECTING TO LIVE GOLD SPOT'}
      async function refresh(){if(busy)return;busy=true;try{const [u,r]=await Promise.all([goldUsd(),usdGbp()]);usd=u;gbp=u*r;lastSuccess=Date.now();render();stamp(true)}catch(e){render();stamp(false)}finally{busy=false}}
      if(toggle&&!toggle.dataset.liveGoldReady){toggle.dataset.liveGoldReady='1';toggle.addEventListener('click',()=>{currency=currency==='GBP'?'USD':'GBP';render()})}
      refresh();
      setInterval(refresh,30000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
      window.addEventListener('focus',refresh);
      setInterval(()=>{if(lastSuccess&&Date.now()-lastSuccess>90000)stamp(false)},10000);
    })();

    const footer=document.createElement('script');
    footer.src='footer.js?v=20261005-1';
    document.body.appendChild(footer);
  };
  document.body.appendChild(core);
})();