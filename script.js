/* Aurum Bullion global loader. The pinned core preserves the current site behaviour while footer.js supplies the single master footer across every page. */
(function(){
  const core=document.createElement('script');
  core.src='https://cdn.jsdelivr.net/gh/benmaurum/aurum-bullion-website@896b0e2d13a05caed33d511d750109fc60362d04/script.js';
  core.onload=function(){
    const footer=document.createElement('script');
    footer.src='footer.js?v=20261005-1';
    document.body.appendChild(footer);
  };
  document.body.appendChild(core);
})();