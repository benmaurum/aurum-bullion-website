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

      /* Restore native playback controls so visitors can seek backwards/forwards, pause and use fullscreen. */
      videos.forEach(v=>{
        v.setAttribute('controls','');
        v.controls=true;
        v.setAttribute('controlsList','nodownload');
      });

      /* The pinned player only registered its automatic 'ended' handler on the original videos. Add it to the new clip. */
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

    const footer=document.createElement('script');
    footer.src='footer.js?v=20261005-1';
    document.body.appendChild(footer);
  };
  document.body.appendChild(core);
})();