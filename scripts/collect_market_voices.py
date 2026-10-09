#!/usr/bin/env python3
"""Read-only newsletter intake. Run privately; never publish its database."""
import email
import fcntl
import imaplib
import os
import re
import sqlite3
import ssl
import json
import stat
from datetime import datetime, timezone
from email import policy
from email.utils import parseaddr
from pathlib import Path

TERMS = re.compile(r'\b(gold|bullion|precious metals?|central banks?|inflation|monetary policy|interest rates?|mining)\b', re.I)
MAX_BYTES = 2 * 1024 * 1024


def candidate(raw):
    msg = email.message_from_bytes(raw, policy=policy.default)
    subject = str(msg.get('Subject', ''))[:500]
    sender = parseaddr(str(msg.get('From', '')))[1]
    parts = []
    for part in msg.walk():
        if part.get_content_type() not in ('text/plain', 'text/html'):
            continue
        if part.get_content_disposition() == 'attachment':
            continue
        try:
            parts.append(part.get_content())
        except (LookupError, UnicodeError, ValueError):
            continue
    body = '\n'.join(parts)
    if not TERMS.search(subject + '\n' + re.sub(r'<[^>]*>', ' ', body)):
        return None
    # These are unverified editorial leads, never approved publication entries.
    return subject, sender, str(msg.get('Date', ''))[:200]


def collect(client, db):
    status, _ = client.select('INBOX', readonly=True)
    if status != 'OK':
        raise RuntimeError('Unable to open the inbox read-only')
    _, validity = client.response('UIDVALIDITY')
    if not validity or not validity[0]:
        raise RuntimeError('Mailbox identity unavailable')
    epoch = validity[0].decode('ascii')
    status, data = client.uid('search', None, 'ALL')
    if status != 'OK':
        raise RuntimeError('Mailbox search failed')
    added = 0
    # Bounded batch; processed UIDs persist so later runs continue older mail.
    pending = [u for u in data[0].split() if not db.execute(
        'SELECT 1 FROM processed WHERE epoch=? AND uid=?',
        (epoch, u.decode('ascii'))).fetchone()][:100]
    for uid in pending:
        status, size_data = client.uid('fetch', uid, '(RFC822.SIZE)')
        size_text = b' '.join(x for x in size_data if isinstance(x, bytes))
        match = re.search(rb'RFC822.SIZE (\d+)', size_text)
        if status != 'OK' or not match:
            continue
        uid_text = uid.decode('ascii')
        if int(match[1]) > MAX_BYTES:
            db.execute('INSERT OR IGNORE INTO processed VALUES (?,?)', (epoch, uid_text))
            db.commit()
            continue
        status, fetched = client.uid('fetch', uid, '(BODY.PEEK[])')
        if status != 'OK':
            continue
        chunks = [x[1] for x in fetched if isinstance(x, tuple) and isinstance(x[1], bytes)]
        if not chunks:
            continue
        item = candidate(b''.join(chunks))
        if item:
            db.execute('INSERT OR IGNORE INTO candidates VALUES (?,?,?,?,?,?,?)',
                       (epoch, uid_text, *item, 'pending_review', datetime.now(timezone.utc).isoformat()))
            added += 1
        db.execute('INSERT OR IGNORE INTO processed VALUES (?,?)', (epoch, uid_text))
        db.commit()
    return added


def main():
    username = os.environ.get('AURUM_IMAP_USERNAME', '')
    password = os.environ.get('AURUM_IMAP_PASSWORD', '')
    location = os.environ.get('AURUM_INTAKE_PRIVATE_DIR', '')
    location = location or str(Path(__file__).resolve().parent)
    root = Path(location).expanduser().resolve()
    if not Path(location).is_absolute() or any(p in ('public', 'public_html', 'htdocs', 'www') for p in root.parts):
        raise RuntimeError('Use an absolute directory outside the website document root')
    if any((p / '.git').exists() or (p / '.github').exists() for p in (root, *root.parents)):
        raise RuntimeError('Private intake must be outside the source checkout')
    os.umask(0o077)
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(root, 0o700)
    lock = open(root / 'collector.lock', 'a')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        lock.close()
        print('Collection already running; skipped.')
        return
    # This file is provisioned privately on IONOS, never in the repository.
    if not password:
        config_path = root / 'credentials.json'
        mode = config_path.lstat()
        if not stat.S_ISREG(mode.st_mode) or stat.S_IMODE(mode.st_mode) & 0o077:
            raise RuntimeError('Private credentials must have owner-only permissions')
        config = json.loads(config_path.read_text(encoding='utf-8'))
        username = config.get('username', '')
        password = config.get('password', '')
    if username != 'intelligence@aurumbullion.co.uk' or not password:
        raise RuntimeError('Configure the intelligence mailbox privately')
    db_path = root / 'market-voices.sqlite3'
    with sqlite3.connect(db_path) as db:
        os.chmod(db_path, 0o600)
        db.executescript('''
          CREATE TABLE IF NOT EXISTS processed (epoch TEXT, uid TEXT, PRIMARY KEY(epoch,uid));
          CREATE TABLE IF NOT EXISTS candidates (
            epoch TEXT, uid TEXT, subject TEXT, sender TEXT, email_date TEXT,
            status TEXT, collected_at TEXT, PRIMARY KEY(epoch,uid));
        ''')
        with imaplib.IMAP4_SSL('imap.ionos.co.uk', 993, ssl_context=ssl.create_default_context(), timeout=30) as client:
            client.login(username, password)
            count = collect(client, db)
    print('Pending editorial candidates added:', count)
    (root / 'last-run.json').write_text(json.dumps({
        'completed_at': datetime.now(timezone.utc).isoformat(),
        'candidates_added': count, 'status': 'success'
    }), encoding='utf-8')
    lock.close()


if __name__ == '__main__':
    try:
        main()
    except Exception:
        # Do not print exception bodies which can expose server or message details.
        raise SystemExit('Newsletter intake failed; check private configuration and mailbox access.')
