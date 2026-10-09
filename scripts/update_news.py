#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

CATEGORIES = {
  'breaking': ('BREAKING NEWS','gold breaking news when:1d'),
  'market': ('GOLD MARKET','gold price market bullion when:1d'),
  'central': ('CENTRAL BANKS','central bank gold reserves buying when:1d'),
  'rates': ('ECONOMY & RATES','gold interest rates inflation Federal Reserve Bank of England when:1d'),
  'geo': ('GEOPOLITICS','gold geopolitical risk safe haven when:1d'),
  'etf': ('GOLD ETFs','gold ETF flows holdings when:1d'),
  'coins': ('BRITISH COINS','British gold coins Sovereign Britannia when:1d'),
  'mint': ('ROYAL MINT','Royal Mint gold coin when:7d'),
  'grading': ('GRADING','NGC PCGS gold coin grading when:7d'),
  'numismatics': ('NUMISMATICS','British gold numismatic coin auction collecting when:7d')
}
PREMIUM_SOURCES = {'Financial Times': ('ft.com','market'), 'Bloomberg': ('bloomberg.com','market'), 'Reuters': ('reuters.com','breaking'), 'The Wall Street Journal': ('wsj.com','rates'), 'The Economist': ('economist.com','rates'), 'MINING.COM': ('mining.com','market'), 'Kitco': ('kitco.com','market')}
SUBSCRIPTION_DOMAINS = ('ft.com','bloomberg.com','wsj.com','economist.com')
UA='Mozilla/5.0 AurumBullionInsights/1.0'

def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',s or '')).strip()
def get_feed(q):
    url='https://news.google.com/rss/search?q='+urllib.parse.quote(q)+'&hl=en-GB&gl=GB&ceid=GB:en'
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=20) as r: return ET.fromstring(r.read())
def dt_iso(s):
    try: return parsedate_to_datetime(s).astimezone(timezone.utc).isoformat()
    except: return datetime.now(timezone.utc).isoformat()

def main():
    stories=[]; seen=set()
    for key,(label,q) in CATEGORIES.items():
        try: root=get_feed(q)
        except Exception as e:
            print(key,e); continue
        taken=0
        for item in root.findall('.//item'):
            title=clean(item.findtext('title')); link=clean(item.findtext('link')); pub=item.findtext('pubDate') or ''
            source_el=item.find('source'); source=clean(source_el.text if source_el is not None else '') or 'News source'
            if not title or not link: continue
            norm=re.sub(r'[^a-z0-9]','',title.lower())[:120]
            if norm in seen: continue
            seen.add(norm)
            stories.append({'category':key,'category_label':label,'headline':title,'source':source,'published_at':dt_iso(pub),'url':link})
            taken+=1
            if taken>=2: break
    # Publisher-specific headline discovery only. No paywall bypass or article reproduction.
    for publisher,(domain,category) in PREMIUM_SOURCES.items():
        try: root=get_feed('site:'+domain+' (gold OR bullion OR central bank OR inflation OR mining) when:7d')
        except Exception as e:
            print('publisher',publisher,e); continue
        taken=0
        for item in root.findall('.//item'):
            title=clean(item.findtext('title')); link=clean(item.findtext('link'))
            source_el=item.find('source'); source=clean(source_el.text if source_el is not None else '') or publisher
            if not title or not link: continue
            if domain.split('.')[0].lower() not in source.lower().replace(' ','') and publisher.lower() not in source.lower(): continue
            norm=re.sub(r'[^a-z0-9]','',title.lower())[:120]
            if norm in seen: continue
            seen.add(norm)
            stories.append({'category':category,'category_label':CATEGORIES[category][0], 'headline':title,'source':source,'published_at':dt_iso(item.findtext('pubDate') or ''),'url':link,'subscription':domain in SUBSCRIPTION_DOMAINS})
            taken+=1
            if taken>=3: break
    stories.sort(key=lambda x:x['published_at'],reverse=True)
    out={'updated_at':datetime.now(timezone.utc).isoformat(),'timezone_display':'Europe/London','target_per_category_per_day':2,'stories':stories}
    with open('news.json','w',encoding='utf-8') as f: json.dump(out,f,ensure_ascii=False,indent=2)
    print('wrote',len(stories),'stories')
if __name__=='__main__': main()
