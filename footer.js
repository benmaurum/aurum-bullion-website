/* Aurum 2.0 master footer. Keep this as the single source of truth for normal site pages. */
(function(){
  const footer=document.querySelector('footer');
  if(!footer) return;
  footer.classList.add('aurum-master-footer');
  footer.innerHTML=`
    <img src="Logo.png" alt="Aurum Bullion PLC">
    <div class="addresses">
      <b>Aurum Bullion PLC</b>
      <p><strong>HQ:</strong> Suite 23, Fifth Floor, 63-66 Hatton Garden, London, EC1N 8LE</p>
      <p><strong>International Desk:</strong> Fifth Floor, 167-169 Great Portland St, London, W1W 5PF</p>
      <p><strong>UK Desk:</strong> 29 Salisbury House, Finsbury Circus, London Wall, London, EC2M 5SQ</p>
      <p><strong>Company Registration No.</strong> 14346693<br><strong>LEI Number:</strong> 984500556DA8CBN5E728<br><strong>ICO Number:</strong> ZB455414</p>
    </div>
    <div>
      <b>Explore</b>
      <a href="catalogue.html">British Gold Coins catalogue</a>
      <a href="sell-to-us.html">Sell to Us</a>
      <a href="delivery.html">Delivery</a>
      <a href="payment-options.html">Payment Options</a>
      <a href="insights.html">Gold Insights</a>
      <a href="brochure.html">Gold Guide</a>
      <a href="index.html#partners">Partners &amp; Industry</a>
      <a href="index.html#responsible-gold">Responsible Gold</a>
      <a href="index.html#legal-tender">Legal Tender</a>
      <a href="index.html#tax">UK Tax Information</a>
    </div>
    <div>
      <b>Legal</b>
      <a href="privacy.html">Privacy Policy</a>
      <a href="cookies.html">Cookies Policy</a>
      <a href="terms.html">Terms &amp; Conditions</a>
      <a href="conflict-free.html">Conflict-Free Policy</a>
    </div>
    <div>
      <b>Contact</b>
      <a href="mailto:info@aurumbullion.co.uk" aria-label="Email Aurum Bullion">✉&nbsp;&nbsp;info@aurumbullion.co.uk</a>
      <a href="tel:+442080640766" aria-label="Telephone Aurum Bullion">☎&nbsp;&nbsp;+44 20 8064 0766</a>
    </div>`;
})();