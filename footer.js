/* Aurum 2.0 master footer and late-page enhancements. */
(function(){
  const footer=document.querySelector('footer');
  if(footer){
    footer.classList.add('aurum-master-footer');
    footer.innerHTML=`
      <div class="footer-brand-contact"><img src="Logo.png" alt="Aurum Bullion PLC"><div class="footer-contact"><b>Contact</b><a href="mailto:info@aurumbullion.co.uk" aria-label="Email Aurum Bullion">✉&nbsp;&nbsp;info@aurumbullion.co.uk</a><a href="tel:+442080640766" aria-label="Telephone Aurum Bullion">☎&nbsp;&nbsp;+44 20 8064 0766</a></div></div>
      <div class="addresses"><b>Aurum Bullion PLC</b><p><strong>HQ:</strong> Suite 23, Fifth Floor, 63-66 Hatton Garden, London, EC1N 8LE</p><p><strong>International Desk:</strong> Fifth Floor, 167-169 Great Portland St, London, W1W 5PF</p><p><strong>UK Desk:</strong> 29 Salisbury House, Finsbury Circus, London Wall, London, EC2M 5SQ</p><p><strong>Company Registration No.</strong> 14346693<br><strong>LEI Number:</strong> 984500556DA8CBN5E728<br><strong>ICO Number:</strong> ZB455414</p></div>
      <div><b>Explore</b><a href="catalogue.html">British Gold Coins catalogue</a><a href="sell-to-us.html">Sell to Us</a><a href="delivery.html">Delivery</a><a href="payment-options.html">Payment Options</a><a href="insights.html">Gold Insights</a><a href="brochure.html">Gold Guide</a><a href="index.html#partners">Partners &amp; Industry</a><a href="index.html#responsible-gold">Responsible Gold</a><a href="index.html#legal-tender">Legal Tender</a><a href="index.html#tax">UK Tax Information</a></div>
      <div><b>Legal</b><a href="privacy.html">Privacy Policy</a><a href="cookies.html">Cookies Policy</a><a href="terms.html">Terms &amp; Conditions</a><a href="conflict-free.html">Conflict-Free Policy</a></div>`;
  }

  /* Ghana video controls. The source clips remain permanently muted by script.js. */
  const ghana=document.querySelector('.ghana-video-showcase');
  if(ghana && !ghana.querySelector('.ghana-playback-controls')){
    const clips=[...ghana.querySelectorAll('[data-ghana-video]')];
    const controls=document.createElement('div');
    controls.className='ghana-playback-controls';
    controls.innerHTML='<button type="button" data-gprev aria-label="Previous video">‹</button><button type="button" data-gback aria-label="Back 10 seconds">−10</button><button type="button" data-gplay aria-label="Pause or play">❚❚</button><input data-gseek type="range" min="0" max="100" value="0" step="0.1" aria-label="Video position"><button type="button" data-gforward aria-label="Forward 10 seconds">+10</button><button type="button" data-gnext aria-label="Next video">›</button>';
    ghana.appendChild(controls);
    function active(){return clips.find(v=>v.style.visibility==='visible')||clips.find(v=>!v.paused)||clips[0]}
    function jumpClip(dir){let v=active(),i=Math.max(0,clips.indexOf(v)),n=(i+dir+clips.length)%clips.length;v.pause();v.style.opacity='0';v.style.visibility='hidden';v.style.zIndex='1';let nv=clips[n];nv.muted=true;nv.defaultMuted=true;nv.volume=0;nv.style.opacity='1';nv.style.visibility='visible';nv.style.zIndex='2';try{nv.currentTime=0}catch(e){}nv.play().catch(()=>{});}
    controls.querySelector('[data-gprev]').onclick=()=>jumpClip(-1);
    controls.querySelector('[data-gnext]').onclick=()=>jumpClip(1);
    controls.querySelector('[data-gback]').onclick=()=>{let v=active();v.currentTime=Math.max(0,v.currentTime-10)};
    controls.querySelector('[data-gforward]').onclick=()=>{let v=active();v.currentTime=Math.min(v.duration||v.currentTime+10,v.currentTime+10)};
    controls.querySelector('[data-gplay]').onclick=e=>{let v=active();v.muted=true;v.volume=0;if(v.paused){v.play().catch(()=>{});e.currentTarget.textContent='❚❚'}else{v.pause();e.currentTarget.textContent='▶'}};
    const seek=controls.querySelector('[data-gseek]');
    seek.oninput=()=>{let v=active();if(Number.isFinite(v.duration)&&v.duration>0)v.currentTime=(+seek.value/100)*v.duration};
    setInterval(()=>{let v=active();if(v){v.muted=true;v.defaultMuted=true;v.volume=0;if(Number.isFinite(v.duration)&&v.duration>0&&!seek.matches(':active'))seek.value=(v.currentTime/v.duration)*100;controls.querySelector('[data-gplay]').textContent=v.paused?'▶':'❚❚'}},250);
  }

  /* Homepage collection: obverse-first, clickable educational cards, plus Sovereign. */
  const cards=document.querySelector('.collections .cards');
  if(cards){
    const existing=[...cards.querySelectorAll('.card')];
    const setup=[
      ['coin-guide.html#britannia','1. 2010 GOLD PROOF BRITANNIA £100 1OZ.png'],
      ['coin-guide.html#tudor-beasts','2022 Lion of England UK 2oz Gold Proof_Obverse.webp'],
      ['coin-guide.html#masterpieces','2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof_Obverse.jpg'],
      ['coin-guide.html#commemoratives','2022 City Views London UK 1oz Gold Proof_Obverse.jpg']
    ];
    existing.forEach((card,i)=>{if(!setup[i])return;card.setAttribute('role','link');card.tabIndex=0;card.dataset.href=setup[i][0];let img=card.querySelector('img');if(img){img.src=setup[i][1];img.style.content='normal'}card.onclick=()=>location.href=card.dataset.href;card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();location.href=card.dataset.href}}});
    if(!cards.querySelector('[data-sovereign-card]')){
      const a=document.createElement('article');a.className='card';a.dataset.sovereignCard='1';a.setAttribute('role','link');a.tabIndex=0;a.dataset.href='coin-guide.html#sovereign';a.innerHTML='<div class="visual"><img class="coin-blend" src="14. 2020 Five Sovereign Gold Proof Coin.png" alt="British Sovereign gold proof coin obverse"></div><p>BRITISH CLASSIC</p><h3>The Sovereign</h3><span>One of Britain’s most important and enduring gold coins, with a history stretching back centuries.</span>';a.onclick=()=>location.href=a.dataset.href;a.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();location.href=a.dataset.href}};cards.appendChild(a);
    }
  }

  /* Catalogue: uploaded verified obverse is always primary; reverse appears only on hover/click. */
  if(document.getElementById('products')){
    const pairs={
      '2021 Mr. Happy – 50th Anniversary Mr. Men Little Miss UK One Ounce Gold Proof Coin':['2021 Mr. Happy  50th Anniversary 1oz Gold Proof_Obverse.webp','2021 Mr. Happy 50th Anniversary 1oz Gold Proof_Reverse.webp'],
      '2022 City Views London UK 1oz Gold Proof Coin':['2022 City Views London UK 1oz Gold Proof_Obverse.jpg','2022 City Views London UK 1oz Gold Proof_Reverse.jpg'],
      '2022 City Views London UK 2oz Gold Proof Coin':['2022 City Views London UK 2oz Gold Proof_Obverse.webp','2022 City Views London UK 2oz Gold Proof_Reverse.jpg'],
      '2022 Faerie Queene 1oz Gold Proof Coin':['2022 Faerie Queene 1oz Gold Proof_Obverse.jpg','2022 Faerie Queene 1oz Gold Proof_Reverse.webp'],
      '2022 The Seymour Panther UK 1oz Gold Proof Coin':['2022 Seymour Panther UK 1oz Gold Proof_Obverse.webp','2022 Seymour Panther UK 1oz Gold Proof_Reverse.jpg'],
      '2022 The Royal Tudor Beasts The Lion of England UK 2oz Gold Proof Coin':['2022 Lion of England UK 2oz Gold Proof_Obverse.webp','2022 Lion of England UK 2oz Gold Proof_Reverse.jpg'],
      '2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof Coin':['2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof_Obverse.jpg','2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof_Reverse.jpg']
    };
    function patchProducts(){document.querySelectorAll('#products .product').forEach(card=>{let title=card.querySelector('h2')?.textContent.trim(),p=pairs[title];if(!p||card.dataset.verifiedPair==='1')return;card.dataset.verifiedPair='1';let visual=card.querySelector('.visual');if(!visual)return;let img=visual.querySelector('img');if(!img){img=document.createElement('img');visual.prepend(img)}img.src=p[0];img.alt='Obverse view of '+title;img.dataset.name=title;let sides=visual.querySelector('.sides');if(!sides){sides=document.createElement('div');sides.className='sides';visual.appendChild(sides)}sides.innerHTML='<button class="active" type="button">Obverse</button><button type="button">Reverse</button>';let btn=[...sides.querySelectorAll('button')];function show(n){img.src=p[n];img.alt=(n?'Reverse':'Obverse')+' view of '+title;btn.forEach((b,i)=>b.classList.toggle('active',i===n));visual.dataset.active=n}btn[0].onclick=e=>{e.stopPropagation();show(0)};btn[1].onclick=e=>{e.stopPropagation();show(1)};visual.addEventListener('mouseenter',()=>show(1));visual.addEventListener('mouseleave',()=>show(0));});}
    const mo=new MutationObserver(()=>setTimeout(patchProducts,0));mo.observe(document.getElementById('products'),{childList:true,subtree:true});setTimeout(patchProducts,700);
  }

  const style=document.createElement('style');style.textContent='.ghana-playback-controls{position:absolute!important;left:16px!important;right:16px!important;bottom:14px!important;z-index:20!important;display:grid!important;grid-template-columns:auto auto auto 1fr auto auto!important;gap:7px!important;align-items:center!important;background:rgba(25,29,31,.82)!important;padding:8px 10px!important;border-radius:3px!important}.ghana-playback-controls button{border:1px solid rgba(255,255,255,.55)!important;background:rgba(255,255,255,.12)!important;color:#fff!important;min-width:38px!important;height:34px!important;cursor:pointer!important}.ghana-playback-controls input{width:100%!important;accent-color:#D4AF37!important}.collections .card[role="link"]{cursor:pointer!important}.collections .card[role="link"]:hover{transform:translateY(-3px);transition:transform .18s ease}.collections .cards{grid-template-columns:repeat(5,1fr)!important}@media(max-width:1100px){.collections .cards{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:650px){.collections .cards{grid-template-columns:1fr!important}.ghana-playback-controls{left:7px!important;right:7px!important;bottom:7px!important;grid-template-columns:auto auto auto 1fr auto auto!important;gap:3px!important;padding:6px!important}.ghana-playback-controls button{min-width:31px!important;font-size:10px!important}}';document.head.appendChild(style);
})();