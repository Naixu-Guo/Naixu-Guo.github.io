"""Read one bounded arXiv API page or an offline Atom fixture; emit metadata only."""
import argparse
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--input', help='Read saved Atom XML instead of making a network request')
args = parser.parse_args()
if args.input:
    with open(args.input, 'rb') as stream:
        raw = stream.read(5_000_001)
else:
    query = urllib.parse.urlencode({'search_query': 'au:"Naixu_Guo"', 'start': 0, 'max_results': 100, 'sortBy': 'submittedDate', 'sortOrder': 'descending'})
    request = urllib.request.Request('https://export.arxiv.org/api/query?' + query, headers={'User-Agent': 'NaixuGuoHomepage/1.0 (manual metadata collection)'})
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read(5_000_001)
if len(raw) > 5_000_000 or b'<!DOCTYPE' in raw or b'<!ENTITY' in raw:
    raise ValueError('Oversized or unsupported XML feed')
ns = {'a': 'http://www.w3.org/2005/Atom'}
records = []
for entry in ET.fromstring(raw).findall('a:entry', ns):
    def field(name):
        return ' '.join((entry.findtext('a:' + name, default='', namespaces=ns)).split())
    match = re.search(r'/(\d{4}\.\d{4,5})(?:v\d+)?$', field('id'))
    if not match:
        continue
    records.append({'arxiv': match.group(1), 'title': field('title'), 'authors': [' '.join(a.findtext('a:name', default='', namespaces=ns).split()) for a in entry.findall('a:author', ns)], 'published': field('published')[:10], 'updated': field('updated')[:10]})
print(json.dumps(records, ensure_ascii=False))
