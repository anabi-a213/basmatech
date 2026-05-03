"""Submit 9 walk-in keyframe pairs to Kling 2.1 Master via Fal.ai in parallel.

Start frames live in:   brand-imagery/generated/sequences/walks/walk-NN-start.jpg
End frames live in:     apps/portfolio/public/rooms/hero-NN-*.jpg

Output: brand-imagery/generated/sequences/videos/walks-manifest.json
"""
import json, base64, urllib.request, urllib.error, os, sys, io
from PIL import Image

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
WALKS = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'walks')
ROOMS = os.path.join(ROOT, 'apps', 'portfolio', 'public', 'rooms')

WALKS_DEFS = [
    ('01', 'hero-01-hotel.jpg',
     'Smooth cinematic camera push-in toward the back wall of a luxury hotel lobby in Jeddah. As we approach, '
     'a kinetic mirror wall composed of hundreds of independently-tilting hexagonal mirror tiles materializes '
     'and comes alive: tiles start tilting in a slow ripple pattern, catching warm late-afternoon light, '
     'champagne and brushed steel tones revealed. Calm, magazine-quality. Smooth continuous forward motion. No people.'),
    ('02', 'hero-02-retail.jpg',
     'Smooth cinematic camera push-in toward the back wall of a luxury retail flagship boutique in Riyadh. '
     'As we approach, a 7-meter wide interactive mirror wall composed of 144 polished circular mirrors materializes '
     'and comes alive: mirrors begin tilting in a fractured pixelated pattern. A magenta neon line traces itself '
     'along the floor seam from entrance to back wall. Smooth continuous forward motion. No people.'),
    ('03', 'hero-03-mall.jpg',
     'Smooth cinematic camera push-in across a competitive game arena floor in Riyadh. As we approach, '
     'the 540 pressure-sensing floor tiles ignite in waves of soft pastel light forming an active competitive '
     'grid, two team scoring podiums emerge with vertical 4-meter magenta light columns, and the surrounding '
     'wall LED panels switch on showing real-time game state and abstract crowd visualizations. Embedded floor '
     'LED strips radiate outward. Smooth continuous forward motion. Sports-arena scale. No people.'),
    ('04', 'hero-04-event.jpg',
     'Smooth cinematic camera push-in toward an activation pavilion at a Riyadh stadium concourse. '
     'As we approach, a plain white event tent transforms: a parametric kinetic facade made of small triangular '
     'brass-toned panels wraps the exterior, beginning to ripple. A magenta light column ignites at center. '
     'Smooth continuous forward motion. Late afternoon golden hour. No people.'),
    ('05', 'hero-05-corporate.jpg',
     'Smooth cinematic camera push-in into the grand atrium of an energy company in Riyadh. As we move forward, '
     'a horizontal kinetic ceiling installation of 140 brass and bronze hexagonal tiles materializes overhead and '
     'comes alive in a slow flowing wave pattern, catching natural light from the glass roof above. '
     'Smooth continuous forward motion. Riyadh skyline visible through tall windows. No people.'),
    ('06', 'hero-06-cultural.jpg',
     'Smooth cinematic camera push-in toward the center of a cultural performance hall in AlUla. As we approach, '
     '63 long bronze and copper rectangular ceiling segments materialize and begin moving in synchrony, forming '
     'a flowing wave pattern overhead. Warm uplighting from the floor casts dramatic elongated shadows. '
     'Smooth continuous forward motion. No people.'),
    ('07', 'hero-07-restaurant.jpg',
     'Smooth cinematic camera push-in across an open-air interactive screen plaza on a Riyadh waterfront at '
     'twilight. As we move forward, 5 massive curved interactive LED screens at varying heights ignite one by '
     'one, each displaying flowing pastel artwork that ripples in response to invisible visitor presence. '
     'Embedded magenta floor LED grid lines glow and pulse in waves. Atmospheric haze catches every light source. '
     'Smooth continuous forward motion. Riyadh skyline visible at deep dusk blue. No people focus.'),
    ('08', 'hero-08-launch.jpg',
     'Smooth cinematic camera push-in into a dark immersive product launch room. As we move forward toward the '
     'central pedestal, the 360-degree projection on all four walls and ceiling ignites and comes alive: flowing '
     'pastel liquid abstract imagery in mint, sky blue, lavender, pink, and magenta swirls wraps the entire room. '
     'Atmospheric haze appears. Smooth continuous forward motion. Reverent atmosphere. No people.'),
    ('09', 'hero-09-ops.jpg',
     'Slow aerial pull-back over a Saudi cityscape at twilight. As the camera rises, magenta beacons light up '
     'one by one across the city marking 9 installations, and faint magenta connection lines arc gracefully '
     'between them, revealing the network. Smooth continuous aerial pull-back motion. Atmospheric.'),
]

def downsample_to_b64(path, max_w=1280):
    img = Image.open(path).convert('RGB')
    img.thumbnail((max_w, 720), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=88, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

def submit(num, end_filename, prompt):
    start = os.path.join(WALKS, f'walk-{num}-start.jpg')
    end   = os.path.join(ROOMS, end_filename)
    if not os.path.exists(start) or not os.path.exists(end):
        return num, None, f'missing {start} or {end}'
    body = json.dumps({
        'prompt': prompt,
        'image_url': f'data:image/jpeg;base64,{downsample_to_b64(start)}',
        'tail_image_url': f'data:image/jpeg;base64,{downsample_to_b64(end)}',
        'duration': '5',
        'aspect_ratio': '16:9',
        'negative_prompt': 'blurry, low quality, people, hands, faces, fingers, text, watermark, logo, distorted'
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
for num, end_filename, prompt in WALKS_DEFS:
    n, rid, status_url = submit(num, end_filename, prompt)
    manifest[num] = {'request_id': rid, 'status_url': status_url}
    print(f'walk-{num}: rid={rid}')

out = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'walks-manifest.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)
print(f'manifest -> {out}')
