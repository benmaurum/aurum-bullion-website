# Migration audit — 7 October 2026

86 recovered legacy URLs, including query variants; 81 redirect mappings deployed to IONOS. Five require review: /bonds/, /login/, /register/, /bonds-register/, /testimonial/. No equivalent content or functionality has been verified for these five routes. Public sources cannot prove exhaustive coverage; obtain Google Search Console page data and an old WordPress export, sitemap or access logs.

42 legacy product routes redirect to 39 unique server-rendered coin pages. Availability and price are on request; historical prices and stock are not represented as current. Sitemap contains 54 canonical URLs. Catalogue contains 48 records with connected images and a single filtering pipeline.

Live checks: all 42 legacy product paths reached the expected coin page with no broken loaded images; 15 representative informational/category redirects reached the expected destinations; 15 current HTML pages reviewed for headings and horizontal overflow; catalogue search, 2022 filter, gallery switching and specific-coin enquiry hand-off passed. Known coin pages render; unknown coin identifiers produce 404/noindex. Form submission backend was not modified in this audit; prior deployment included successful delivery tests.

Pending deployment: final asset version 20261007-audit-final across HTML/PHP/script references and Cache-Control revalidation headers. Browser became unresponsive before uploading this final update. Earlier catalogue/redirect/product-page changes are already live. Do not describe this final cache patch as deployed until verified on IONOS.

No DNS or mailbox changes. Five unresolved legacy functions and unseen legacy URLs remain outside completed migration. No guarantee of current Google index coverage or ranking.
