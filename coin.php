<?php
declare(strict_types=1);
header('X-Content-Type-Options: nosniff');
function h(string $text): string { return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
$records = json_decode((string) file_get_contents(__DIR__ . '/coin-pages.json'), true);
$item = $_GET['item'] ?? '';
$coin = is_string($item) && is_array($records) ? ($records[$item] ?? null) : null;
if (!is_array($coin)) {
    http_response_code(404);
    header('X-Robots-Tag: noindex');
}
$title = $coin['title'] ?? 'Coin not found';
$canonical = 'https://www.aurumbullion.co.uk/coin.php?item=' . rawurlencode(is_string($item) ? $item : '');
$enquiry = 'index.html?selection=' . rawurlencode($title . ' - please confirm availability, price and certification') . '#contact';
?>
<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= h($title) ?> | Aurum Bullion PLC</title>
<meta name="description" content="<?= h('Enquire about ' . $title . ' with Aurum Bullion PLC. Confirm current availability, price, condition and certification with our London specialist team.') ?>">
<?php if ($coin): ?><link rel="canonical" href="<?= h($canonical) ?>"><?php else: ?><meta name="robots" content="noindex"><?php endif; ?>
<link rel="icon" href="Logo.png"><link rel="stylesheet" href="styles.css">
<style>.coin-page{padding:90px 7vw 80px;max-width:1300px;margin:auto}.coin-page h1{font:clamp(32px,4vw,56px)/1.15 Georgia;color:#343434}.coin-page p{line-height:1.8;max-width:850px}.coin-pictures{display:flex;gap:24px;flex-wrap:wrap;margin:35px 0}.coin-pictures figure{margin:0;flex:1;min-width:220px;max-width:480px}.coin-pictures img{width:100%;height:360px;object-fit:contain}.coin-pictures figcaption{color:#777;font-size:12px;margin-top:10px}.coin-actions{display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin:30px 0}.coin-note{font-size:13px;color:#666;border-top:1px solid #ddd;padding-top:20px}</style></head><body>
<div class="market"><span>LIVE GOLD</span><b id="goldpair">XAU/GBP</b><span id="gold">Loading live spot…</span><button class="currency-toggle" id="currencyToggle">GBP / USD</button><span id="goldtime"></span></div>
<header><a class="brand" href="index.html"><img src="Logo.png" alt="Aurum Bullion PLC"></a><button class="menu" aria-label="Open navigation">☰</button><nav><a href="index.html#about">Why Aurum</a><a href="catalogue.html">Collection</a><a href="index.html#graded">Grading</a><a href="index.html#responsible-gold">Responsible Gold</a><a href="partners.html">Partners</a><a href="insights.html">News</a><a href="brochure.html">Learn</a><a href="coin-guide.html">Knowledge</a></nav><a class="cta small" href="index.html#contact">Speak to a Specialist</a></header>
<main class="coin-page"><p class="eyebrow">THE AURUM COLLECTION</p><h1><?= h($title) ?></h1>
<?php if ($coin): ?>
<p><?= h($coin['specification']) ?></p>
<?php if (!empty($coin['images'])): ?><div class="coin-pictures"><?php foreach ($coin['images'] as $image): ?><figure><a href="<?= h(rawurlencode($image['file'])) ?>"><img src="<?= h(rawurlencode($image['file'])) ?>" alt="<?= h($image['label'] . ' of ' . $title) ?>"></a><figcaption><?= h($image['label']) ?>. Select the photograph for a larger view.</figcaption></figure><?php endforeach; ?></div><?php endif; ?>
<h2>Availability and price on request</h2><p>Discuss this coin with an Aurum specialist. We will confirm the exact issue, condition, grading, certification, current price and availability before any purchase.</p>
<div class="coin-actions"><a class="cta" href="<?= h($enquiry) ?>">Enquire about this coin</a><a href="catalogue.html">Browse the current collection</a></div>
<?php if ($coin['current_id']): ?><p><a href="catalogue.html?coin=<?= (int)$coin['current_id'] ?>">View this coin in the collection</a></p><?php else: ?><p class="coin-note">This coin appeared in Aurum's previous collection. It is not currently displayed in the main catalogue. This page does not confirm that it is in stock or available to order.</p><?php endif; ?>
<p class="coin-note">Photographs, where shown, identify the coin issue. Confirm the individual specimen and certification with our team. Coin values can rise or fall; no future return or resale value is guaranteed.</p>
<?php else: ?><p>We could not find this coin page. Browse our current collection or speak to the Aurum team about the coin you are looking for.</p><div class="coin-actions"><a class="cta" href="catalogue.html">View the collection</a><a href="index.html#contact">Contact Aurum</a></div><?php endif; ?>
</main><footer class="site-footer-compact"><div class="footer-brand"><img src="Logo.png" alt="Aurum Bullion PLC"><a href="mailto:info@aurumbullion.co.uk">info@aurumbullion.co.uk</a></div></footer><script src="script.js?v=20261007-audit-final"></script></body></html>
