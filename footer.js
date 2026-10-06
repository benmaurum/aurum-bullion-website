/* Aurum 2.0 master footer and catalogue image enhancements. */
(function(){
  const footer=document.querySelector('footer');
  if(footer){footer.classList.add('aurum-master-footer');footer.innerHTML=`<div class="footer-brand-contact"><img src="Logo.png" alt="Aurum Bullion PLC"><div class="footer-contact"><b>Contact</b><a href="mailto:info@aurumbullion.co.uk">✉&nbsp;&nbsp;info@aurumbullion.co.uk</a><a href="tel:+442080640766">☎&nbsp;&nbsp;+44 20 8064 0766</a></div></div><div class="addresses"><b>Aurum Bullion PLC</b><p><strong>HQ:</strong> Suite 23, Fifth Floor, 63-66 Hatton Garden, London, EC1N 8LE</p><p><strong>International Desk:</strong> Fifth Floor, 167-169 Great Portland St, London, W1W 5PF</p><p><strong>UK Desk:</strong> 29 Salisbury House, Finsbury Circus, London Wall, London, EC2M 5SQ</p><p><strong>Company Registration No.</strong> 14346693<br><strong>LEI Number:</strong> 984500556DA8CBN5E728<br><strong>ICO Number:</strong> ZB455414</p></div><div><b>Explore</b><a href="catalogue.html">British Gold Coins catalogue</a><a href="sell-to-us.html">Sell to Us</a><a href="delivery.html">Delivery</a><a href="payment-options.html">Payment Options</a><a href="insights.html">Gold Insights</a><a href="brochure.html">Gold Guide</a><a href="index.html#responsible-gold">Responsible Gold</a><a href="index.html#legal-tender">Legal Tender</a><a href="index.html#tax">UK Tax Information</a></div><div><b>Legal</b><a href="privacy.html">Privacy Policy</a><a href="cookies.html">Cookies Policy</a><a href="terms.html">Terms &amp; Conditions</a><a href="conflict-free.html">Conflict-Free Policy</a></div><div class="footer-risk-disclaimer"><p><strong>Important information and risk warning.</strong> Information on this website is provided for general information and educational purposes only. It does not constitute personal investment, financial, legal, tax or accounting advice, or a recommendation to buy or sell any particular coin or precious-metal product. Product availability, payment, delivery, storage and other services may vary according to the product, transaction and customer circumstances.</p><p>Gold, bullion, proof, graded and collectable coin prices can rise or fall. Values may be affected by the underlying precious-metal price as well as factors including condition, grade, rarity, mintage, provenance, design, collector demand, currency movements and market liquidity. You may receive less than you paid if you later sell a coin. Past or historic performance is not a reliable indicator of future performance and no future value, return or resale price is guaranteed.</p><p>Before making a purchase, you should consider whether physical gold or collectable coins are appropriate for your objectives, financial circumstances and ability to bear loss, and seek independent financial, legal, tax or accounting advice where appropriate. Diversification can reduce concentration risk, but does not eliminate investment risk.</p><p>Where a product price is displayed, it may reflect the value of the precious metal together with an Aurum premium reflecting factors such as sourcing, rarity, condition, certification, presentation and service. Any promotion or discount will apply only as expressly stated in the relevant offer.</p><p><strong>Regulatory status:</strong> Direct ownership of physical gold and other commodities is generally outside the Financial Conduct Authority's regulatory perimeter. Accordingly, purchases of physical bullion, proof, graded or collectable gold coins will generally not benefit from the protections of the Financial Ombudsman Service or the Financial Services Compensation Scheme in relation to the performance or value of the physical asset. Different rules may apply to separate regulated services or products, if any. Customers should establish what regulatory protections apply to a particular transaction before proceeding.</p></div>`}

  /* Homepage curated collection is controlled exclusively by script.js.
     Do not add, replace or append cards here. This prevents duplicate Sovereign cards. */

  /* Catalogue verified pairs: design/reverse is the default view; portrait/obverse appears on hover. */
  if(document.getElementById('products')){
    const pairs={
      '2021 Mr. Happy – 50th Anniversary Mr. Men Little Miss UK One Ounce Gold Proof Coin':['2021 Mr. Happy  50th Anniversary 1oz Gold Proof_Obverse.webp','2021 Mr. Happy 50th Anniversary 1oz Gold Proof_Reverse.webp'],
      '2022 City Views London UK 1oz Gold Proof Coin':['2022 City Views London UK 1oz Gold Proof_Obverse.jpg','2022 City Views London UK 1oz Gold Proof_Reverse.jpg'],
      '2022 City Views London UK 2oz Gold Proof Coin':['2022 City Views London UK 2oz Gold Proof_Obverse.webp','2022 City Views London UK 2oz Gold Proof_Reverse.jpg'],
      '2022 Faerie Queene 1oz Gold Proof Coin':['2022 Faerie Queene 1oz Gold Proof_Obverse.jpg','2022 Faerie Queene 1oz Gold Proof_Reverse.webp'],
      '2022 The Seymour Panther UK 1oz Gold Proof Coin':['2022 Seymour Panther UK 1oz Gold Proof_Obverse.webp','2022 Seymour Panther UK 1oz Gold Proof_Reverse.jpg'],
      '2022 The Royal Tudor Beasts The Lion of England UK 2oz Gold Proof Coin':['2022 Lion of England UK 2oz Gold Proof_Obverse.webp','2022 Lion of England UK 2oz Gold Proof_Reverse.jpg'],
      '2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof Coin':['2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof_Obverse.jpg','2022 Masterpiece Gothic Victoria Crown 5oz Gold Proof_Reverse.jpg'],
      '2022 Goddess Hera 1oz Gold Proof Coin':['2022 Goddess Hera 1oz Gold Proof_Obverse.jpg','2022 Goddess Hera 1oz Gold Proof_Reverse.webp']
    };
    function wire(card,title,p){
      if(card.dataset.verifiedPair==='1')return;
      card.dataset.verifiedPair='1';
      let visual=card.querySelector('.visual'),img=visual&&visual.querySelector('img');
      if(!visual)return;
      if(!img){img=document.createElement('img');visual.prepend(img)}
      let sides=visual.querySelector('.sides');
      if(!sides){sides=document.createElement('div');sides.className='sides';visual.appendChild(sides)}
      sides.innerHTML='<button class="active" type="button">Design</button><button type="button">Portrait</button>';
      let btn=[...sides.querySelectorAll('button')];
      function showDesign(){img.src=p[1];img.alt='Design / reverse view of '+title;btn[0].classList.add('active');btn[1].classList.remove('active');visual.dataset.active='design'}
      function showPortrait(){img.src=p[0];img.alt='Portrait / obverse view of '+title;btn[1].classList.add('active');btn[0].classList.remove('active');visual.dataset.active='portrait'}
      btn[0].onclick=e=>{e.stopPropagation();showDesign()};
      btn[1].onclick=e=>{e.stopPropagation();showPortrait()};
      visual.addEventListener('mouseenter',showPortrait);
      visual.addEventListener('mouseleave',showDesign);
      showDesign();
    }
    function patch(){
      let box=document.getElementById('products');if(!box)return;
      document.querySelectorAll('#products .product').forEach(card=>{let title=card.querySelector('h2')?.textContent.trim(),p=pairs[title];if(p)wire(card,title,p)});
      if(!box.querySelector('[data-hera-product]')){
        let card=document.createElement('article');card.className='product';card.dataset.heraProduct='1';
        card.innerHTML='<div class="visual" data-active="design"><img src="2022 Goddess Hera 1oz Gold Proof_Reverse.webp" alt="Design / reverse view of 2022 Goddess Hera 1oz Gold Proof Coin"></div><small>2022 · Gold · St Helena</small><h2>2022 Goddess Hera 1oz Gold Proof Coin</h2><p class="price">Price on request</p><p class="desc">A 2022 St Helena Goddess Hera one-ounce gold proof issue. Contact our specialist team for availability, certification and full issue details.</p><button class="buy" onclick="location.href=\'index.html#contact\'">Buy / Enquire</button>';
        box.appendChild(card);wire(card,'2022 Goddess Hera 1oz Gold Proof Coin',pairs['2022 Goddess Hera 1oz Gold Proof Coin']);
      }
    }
    const mo=new MutationObserver(()=>setTimeout(patch,0));mo.observe(document.getElementById('products'),{childList:true,subtree:true});setTimeout(patch,700);
  }
})();