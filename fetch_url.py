import urllib.request, re, json
req = urllib.request.Request('https://labs.google/fx/tools/whisk/share/animate/3o2mhsar40000', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'https?://[^\s\"\'<>]+?\.mp4', html)
    print("MP4 files:", urls)
    
    # Try to find any other video urls
    other_urls = re.findall(r'https?://[^\s\"\'<>]+?\.webm', html)
    print("WebM files:", other_urls)
    
    # Dump it just in case
    with open("temp_dump.html", "w", encoding="utf-8") as f:
        f.write(html)
except Exception as e:
    print(e)
