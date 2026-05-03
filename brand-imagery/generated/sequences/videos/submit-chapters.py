"""Submit 4 Site 1 chapter videos via Kling 2.1 Master."""
import json, base64, urllib.request, urllib.error, os, sys, io
from PIL import Image

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
CHAPTERS = os.path.join(ROOT, 'brand-imagery', 'generated', 'chapters')

CHAPTER_DEFS = [
    ('02', 'Imprint forms',
     'Cinematic moment: a single point of magenta light at center of a soft pastel cream field '
     'slowly expands and crystallizes into a hexagonal mirror tile that gracefully materializes '
     'and rotates into focus, settling at center frame in polished champagne-bronze with brushed '
     'steel facets. Three faint translucent stacked-layer wisps in soft mint, sky blue, and pastel '
     'pink emerge to form a gentle halo around the tile. Smooth liquid emergence. Calm, atmospheric, '
     'museum-specimen brand opening moment. NO PEOPLE.'),
    ('03', 'Workshop assembly',
     'Top-down workshop bench camera, smooth time-lapse mechanical assembly. Scattered components — '
     '8 hexagonal champagne-bronze mirror tiles, NEMA17 stepper motors, a green PCB controller, '
     'ribbon cables, hex bolts, aluminum brackets — slide together and assemble themselves around '
     'each tile, joining into a complete kinetic wall module section. The brass "RIYADH WORKSHOP" '
     'plate visible. Smooth precise mechanical motion. Engineering craft revealed. NO PEOPLE, NO HANDS.'),
    ('04', 'Awakening wave',
     'Wide architectural shot of a luxury Saudi corporate atrium. The kinetic wall on the back wall '
     'awakens: 312 hexagonal champagne-bronze tiles begin to tilt in sequence, forming a graceful '
     'diagonal wave pattern across the wall. Each tile catches reflected late-afternoon Riyadh light. '
     'Smooth continuous tilting motion. Cinematic editorial Wallpaper magazine quality. NO PEOPLE.'),
    ('05', 'Kingdom illuminates',
     'Aerial pull-back over the Saudi Arabian peninsula at twilight. As the camera rises, 6 magenta '
     'beacons light up one by one across the kingdom — Riyadh first (brightest, central), then Jeddah, '
     'NEOM, AlUla, Red Sea, Dammam. Faint magenta connection lines arc gracefully between cities, '
     'completing a unified network like a constellation. Atmospheric haze and twilight transition. '
     'National Geographic editorial quality.'),
]


def downsample_to_b64(path, max_w=1280):
    img = Image.open(path).convert('RGB')
    img.thumbnail((max_w, 720), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=88, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def submit(num, prompt):
    bare = num.lstrip('0') or '0'
    start = os.path.join(CHAPTERS, f'c{bare}-start.jpg')
    end   = os.path.join(CHAPTERS, f'c{bare}-end.jpg')
    if not os.path.exists(start) or not os.path.exists(end):
        return num, None, f'missing {start} or {end}'
    body = json.dumps({
        'prompt': prompt,
        'image_url': f'data:image/jpeg;base64,{downsample_to_b64(start)}',
        'tail_image_url': f'data:image/jpeg;base64,{downsample_to_b64(end)}',
        'duration': '5',
        'aspect_ratio': '16:9',
        'negative_prompt': 'blurry, low quality, people, hands, faces, text, watermark, distorted'
    }).encode()
    req = urllib.request.Request(
        'https://queue.fal.run/fal-ai/kling-video/v2.1/master/image-to-video',
        data=body,
        headers={'Authorization': f'Key {KEY}', 'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode())
            return num, data.get('request_id'), data.get('status_url')
    except urllib.error.HTTPError as e:
        return num, None, f'ERROR {e.code}: {e.read().decode()[:200]}'


manifest = {}
for num, _label, prompt in CHAPTER_DEFS:
    n, rid, status_url = submit(num, prompt)
    manifest[num] = {'request_id': rid, 'status_url': status_url}
    print(f'chapter-{num}: rid={rid}')

out = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'chapters-manifest.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)
print(f'manifest -> {out}')
