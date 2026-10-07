# Migration audit — 7 October 2026

86 recovered legacy URLs, including query variants; 81 redirect mappings deployed to IONOS. Five require review: /bonds/, /login/, /register/, /bonds-register/, /testimonial/. No equivalent content or functionality has been verified for these five routes. Public sources cannot prove exhaustive coverage; obtain Google Search Console page data and an old WordPress export, sitemap or access logs.

42 legacy product routes redirect to 39 unique server-rendered coin pages. Availability and price are on request; historical prices and stock are not represented as current. Sitemap contains 54 canonical URLs. Catalogue contains 48 records with connected images and a single filtering pipeline.

Live checks: all 42 legacy product paths reached the expected coin page with no broken loaded images; 15 representative informational/category redirects reached the expected destinations; 15 current HTML pages reviewed for headings and horizontal overflow; catalogue search, 2022 filter, gallery switching and specific-coin enquiry hand-off passed. Known coin pages render; unknown coin identifiers produce 404/noindex. Form submission backend was not modified in this audit; prior deployment included successful delivery tests.

Pending deployment: final asset version 20261007-audit-final across HTML/PHP/script references and Cache-Control revalidation headers. Browser became unresponsive before uploading this final update. Earlier catalogue/redirect/product-page changes are already live. Do not describe this final cache patch as deployed until verified on IONOS.

No DNS or mailbox changes. Five unresolved legacy functions and unseen legacy URLs remain outside completed migration. No guarantee of current Google index coverage or ranking.

Follow-up: IONOS uploader stalled at 100%; refreshed Webspace Explorer returned a site-rendered Error 500. Final package still not deployed. Live catalogue recheck: 48 items, 11 correct 2022 results, empty search message and ascending price sort passed; no broken catalogue images. Apex HTTPS opens, but canonical redirect adds an extra slash; prepared fix removes the redundant slash before REQUEST_URI. Mr Happy legacy redirect reached expected coin page.

## Final deployment follow-up

Webspace Explorer recovered; no restore or rollback performed. Final cache versions and canonical redirect fix deployed by archive extraction. Initial repackaged archive had 600 permission metadata and caused a temporary 403; this was corrected to 644, including a second package explicitly setting 100644 ZIP metadata. Final hosting listing has zero files with 600 permissions. All 15 current HTML pages are accessible. Live catalogue: 48 items, no broken catalogue images, final script/footer version present, year filtering, empty search and ascending price sort passed. Mr Happy legacy redirect passed. Fresh apex request with verification query reaches https://www.aurumbullion.co.uk/ with no doubled slash; earlier browser-cached 301 can still show doubled slash. Live spot feed was loading at capture and has previously shown unavailable; its external-provider reliability remains unverified. Five legacy routes and completeness of recovered public URL inventory still require authoritative old-site/Search Console records.


## Checkout deployment, 7 October 2026

Recovered latest production checkout implementation from bf02ba838e15f89ce12c757deee50990a9064660, preserving catalogue image/filter and redirect fixes. Deployed catalogue.html, checkout.html and kyc-portal.html with 644 archive metadata. Production code commit d4403681af189ff804d7632e25c9ba50eeb87137.

Live browser preview test: Collection → Basket → Review Basket & Proceed → Details → Address → KYC → Passport ID type → two explicitly labelled dummy PDFs → consent → Bank Transfer preference → purchase review → generated reference AB-2026-9U8VU8. Details persisted across the KYC return. One document and two documents without consent could not continue. Invalid email blocked. Exact £2,500 basket enters KYC. JavaScript syntax checks passed for all three files.

This is a checkout PREVIEW, not a production request-processing backend. Selected documents are not uploaded; local KYC flags are not verification. Payment methods are preferences only. Requests and references are saved in the visitor browser, not submitted to Aurum or centrally recorded. Updated public wording to describe this accurately, escaped customer details when rendering, corrected email validation and inclusive £2,500 threshold. No real purchase, payment or identity-document submission performed. Secure document handling and server-side request submission/reference records still need implementation before this flow is operational for customers.
