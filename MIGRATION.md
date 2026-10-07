# Migration audit — 7 October 2026

86 recovered legacy URLs, including query variants; 81 redirect mappings deployed to IONOS. Five require review: /bonds/, /login/, /register/, /bonds-register/, /testimonial/. No equivalent content or functionality has been verified for these five routes. Public sources cannot prove exhaustive coverage; obtain Google Search Console page data and an old WordPress export, sitemap or access logs.

42 legacy product routes redirect to 39 unique server-rendered coin pages. Availability and price are on request; historical prices and stock are not represented as current. Sitemap contains 54 canonical URLs. Catalogue contains 48 records with connected images and a single filtering pipeline.

Live checks: all 42 legacy product paths reached the expected coin page with no broken loaded images; 15 representative informational/category redirects reached the expected destinations; 15 current HTML pages reviewed for headings and horizontal overflow; catalogue search, 2022 filter, gallery switching and specific-coin enquiry hand-off passed. Known coin pages render; unknown coin identifiers produce 404/noindex. Form submission backend was not modified in this audit; prior deployment included successful delivery tests.

Pending deployment: final asset version 20261007-audit-final across HTML/PHP/script references and Cache-Control revalidation headers. Browser became unresponsive before uploading this final update. Earlier catalogue/redirect/product-page changes are already live. Do not describe this final cache patch as deployed until verified on IONOS.

No DNS or mailbox changes. Five unresolved legacy functions and unseen legacy URLs remain outside completed migration. No guarantee of current Google index coverage or ranking.

Follow-up: IONOS uploader stalled at 100%; refreshed Webspace Explorer returned a site-rendered Error 500. Final package still not deployed. Live catalogue recheck: 48 items, 11 correct 2022 results, empty search message and ascending price sort passed; no broken catalogue images. Apex HTTPS opens, but canonical redirect adds an extra slash; prepared fix removes the redundant slash before REQUEST_URI. Mr Happy legacy redirect reached expected coin page.

## Final deployment follow-up

Webspace Explorer recovered; no restore or rollback performed. Final cache versions and canonical redirect fix deployed by archive extraction. Initial repackaged archive had 600 permission metadata and caused a temporary 403; this was corrected to 644, including a second package explicitly setting 100644 ZIP metadata. Final hosting listing has zero files with 600 permissions. All 15 current HTML pages are accessible. Live catalogue: 48 items, no broken catalogue images, final script/footer version present, year filtering, empty search and ascending price sort passed. Mr Happy legacy redirect passed. Fresh apex request with verification query reaches https://www.aurumbullion.co.uk/ with no doubled slash; earlier browser-cached 301 can still show doubled slash. Live spot feed was loading at capture and has previously shown unavailable; its external-provider reliability remains unverified. Five legacy routes and completeness of recovered public URL inventory still require authoritative old-site/Search Console records.
