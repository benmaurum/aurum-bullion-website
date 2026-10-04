/* Aurum 2.0 global behaviour */
document.querySelectorAll('.brand img, footer img, .brochure-top img').forEach(img=>{img.src='Logo.png';img.alt='Aurum Bullion PLC'});
let fav=document.querySelector("link[rel~='icon']");if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav)}fav.type='image/png';fav.href='Logo.png';
const menu=document.querySelector('.menu');if(menu)menu.addEventListener('click',()=>{document.querySelector('nav')?.classList.toggle('open')});

/* Ghana field story: one aligned media panel, full-bleed video crop, all original camera audio permanently muted. */
(function(){
 const videos=[...document.querySelectorAll('[data-ghana-video]')];
 const frame=document.querySelector('.ghana-video-showcase');
 const media=document.querySelector('.ghana-media');
 const stills=document.querySelector('.ghana-stills');
 if(!videos.length||!frame||!media||!stills)return;

 /* Force the video and four-image mosaic onto precisely the same top and bottom lines. */
 Object.assign(media.style,{display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:'10px',alignItems:'stretch',margin:'38px 0 55px'});
 [frame,stills].forEach(el=>Object.assign(el.style,{height:'420px',minHeight:'420px',maxHeight:'420px',margin:'0',padding:'0',alignSelf:'stretch',overflow:'hidden',background:'transparent',border:'0'}));
 Object.assign(frame.style,{position:'relative',width:'100%'});
 Object.assign(stills.style,{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',gap:'8px'});
 stills.querySelectorAll('img').forEach(img=>Object.assign(img.style,{display:'block',width:'100%',height:'100%',minHeight:'0',margin:'0',objectFit:'cover',objectPosition:'center'}));

 /* Cover removes the portrait-video side bars without stretching. The frame crops excess height instead. */
 videos.forEach((video,i)=>{
   Object.assign(video.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',objectPosition:'center center',background:'transparent',opacity:i===0?'1':'0',visibility:i===0?'visible':'hidden',transition:'opacity .55s ease'});
   video.muted=true;video.defaultMuted=true;video.volume=0;video.removeAttribute('controls');video.setAttribute('muted','');video.setAttribute('playsinline','');
   video.addEventListener('volumechange',()=>{if(!video.muted||video.volume!==0){video.muted=true;video.volume=0}});
 });
 const dots=[...frame.querySelectorAll('.ghana-video-progress span')];
 const show=i=>{videos.forEach((v,n)=>{const active=n===i;v.style.opacity=active?'1':'0';v.style.visibility=active?'visible':'hidden';if(!active){v.pause();v.currentTime=0}});dots.forEach((d,n)=>{d.classList.toggle('active',n===i);d.style.opacity=n===i?'1':'.32'});videos[i].play().catch(()=>{});};
 videos.forEach((v,i)=>v.addEventListener('ended',()=>show((i+1)%videos.length)));
 show(0);

 /* Traditional Ghana soundtrack. Public-domain historical Ghana recording from Salifu Titah's Band via Wikimedia Commons. */
 const music=document.createElement('audio');
 music.id='ghana-folk-music';music.loop=true;music.preload='auto';music.volume=.16;
 music.src='https://commons.wikimedia.org/wiki/Special:Redirect/file/Babu%20Me-Ee-Say%20Ala%20(c.1952).ogg';
 document.body.appendChild(music);
 const musicButton=document.createElement('button');
 musicButton.type='button';musicButton.textContent='♫ Ghana music';musicButton.setAttribute('aria-label','Play or pause Ghana traditional music');
 Object.assign(musicButton.style,{position:'absolute',right:'12px',top:'12px',zIndex:'5',border:'1px solid rgba(255,255,255,.75)',background:'rgba(20,20,20,.68)',color:'#fff',padding:'8px 11px',fontSize:'10px',letterSpacing:'1px',cursor:'pointer'});
 frame.appendChild(musicButton);
 const startMusic=()=>music.play().then(()=>{musicButton.textContent='❚❚ Music'}).catch(()=>{});
 musicButton.addEventListener('click',e=>{e.stopPropagation();if(music.paused)startMusic();else{music.pause();musicButton.textContent='♫ Ghana music'}});
 /* Browsers block audible autoplay until interaction. Start it at the visitor's first interaction anywhere on the page. */
 const firstInteraction=()=>{startMusic();document.removeEventListener('pointerdown',firstInteraction);document.removeEventListener('keydown',firstInteraction)};
 document.addEventListener('pointerdown',firstInteraction,{once:true});document.addEventListener('keydown',firstInteraction,{once:true});
 music.play().then(()=>{musicButton.textContent='❚❚ Music'}).catch(()=>{});

 const responsive=()=>{
   if(window.innerWidth<=1080){Object.assign(media.style,{gridTemplateColumns:'1fr'});[frame,stills].forEach(el=>{el.style.height='min(62vw,420px)';el.style.minHeight='280px';el.style.maxHeight='420px'})}
   else{Object.assign(media.style,{gridTemplateColumns:'1.15fr .85fr'});[frame,stills].forEach(el=>{el.style.height='420px';el.style.minHeight='420px';el.style.maxHeight='420px'})}
 };
 responsive();window.addEventListener('resize',responsive);
})();

let goldCurrency='GBP',lastUsd=null,lastGbp=null;
function renderGold(){const el=document.getElementById('gold'),pair=document.getElementById('goldpair');if(!el)return;if(goldCurrency==='USD'&&lastUsd){el.textContent='$'+lastUsd.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pair)pair.textContent='XAU/USD'}else if(lastGbp){el.textContent='£'+lastGbp.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pair)pair.textContent='XAU/GBP'}}
async function updateGold(){const el=document.getElementById('gold'),tm=document.getElementById('goldtime');if(!el)return;try{const [g,fx]=await Promise.all([fetch('https://api.gold-api.com/price/XAU').then(r=>r.json()),fetch('https://api.frankfurter.app/latest?from=USD&to=GBP').then(r=>r.json())]);lastUsd=Number(g.price);lastGbp=lastUsd*Number(fx.rates.GBP);if(!Number.isFinite(lastUsd)||!Number.isFinite(lastGbp))throw new Error('price');renderGold();if(tm)tm.textContent='• INDICATIVE LIVE SPOT'}catch(e){el.textContent='Live spot temporarily unavailable';if(tm)tm.textContent=''}}
const toggle=document.getElementById('currencyToggle');if(toggle)toggle.addEventListener('click',()=>{goldCurrency=goldCurrency==='GBP'?'USD':'GBP';renderGold()});updateGold();setInterval(updateGold,300000);

/* Consent banner: necessary-only by default; no non-essential tracking is loaded until separately added and consented. */
(function(){if(localStorage.getItem('aurumCookieChoice'))return;const b=document.createElement('div');b.className='cookie-banner';b.innerHTML='<div><strong>Cookie choices</strong><p>Aurum uses necessary cookies for core site functions. Optional analytics or marketing technologies will only be activated with consent if introduced.</p></div><div><button data-cookie="necessary">Necessary only</button><button class="accept" data-cookie="all">Accept all</button><a href="cookies.html">Cookies Policy</a></div>';document.body.appendChild(b);b.querySelectorAll('[data-cookie]').forEach(x=>x.onclick=()=>{localStorage.setItem('aurumCookieChoice',x.dataset.cookie);b.remove()})})();