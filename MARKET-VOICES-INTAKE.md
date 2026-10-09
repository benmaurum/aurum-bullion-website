# Market Voices mailbox intake

Prepared collector: `scripts/collect_market_voices.py`, Python 3.12 standard library.

Status: prepared, not connected or scheduled. Webmail authentication does not provide an IMAP credential to a background process. No mailbox secret or collected email is committed here.

The collector uses TLS certificate validation, read-only INBOX selection and BODY.PEEK. It does not send mail, change message flags, delete messages, fetch external links or publish content. It extracts only subject, sender and message date for relevant gold-market editorial leads. Sender identity, author, dates, source links and publication rights remain unverified until human review.

Provision a private host with Python, outbound TLS access to imap.ionos.co.uk:993, and a scheduler. A server administrator must privately configure AURUM_IMAP_USERNAME=intelligence@aurumbullion.co.uk, AURUM_IMAP_PASSWORD and AURUM_INTAKE_PRIVATE_DIR outside both the website document root and repository. The directory must also be excluded from any website-serving aliases and public backups. Do not use public GitHub Actions logs, commits or artifacts for collected email. A normal mailbox password may confer write/send access even though this collector operates read-only; use a separate scoped credential if IONOS supports one.

Run one manual collection and verify a genuine newsletter becomes a pending_review record. Then configure the server scheduler to run the same collector hourly, with overlapping runs prevented. Store credentials in the private runtime secret environment, never in cron command lines, source files or public webspace. Monitor count-only results and private operational errors. The local environment cannot establish that production IMAP networking or credentials work.

An authorised editor should inspect the corresponding newsletter in Webmail, verify a public or licensed source link, authorship, role, date, relevance and permitted metadata, and only then create an approved entry in data/market-voice-editorial.json. No raw newsletter text, attachments, private recipient links or subscription tokens should be copied into public files. Existing update_news.py publishes only entries with approved:true; the intake collector never writes that file or news.json.

Deduplication uses mailbox UIDVALIDITY and UID. Each run processes at most 100 previously unseen messages. Messages over 2 MiB are skipped. Attachments are not parsed or retained. Candidate records stay private; configure retention before enabling production collection.
