"""Submit 8 cross-project transition videos via Kling 2.1 Master.

Each transition morphs:  project N's alive hero  →  project N+1's empty start.
The result, played scroll-locked, dissolves the first installation through a
pastel atmospheric haze and emerges in the next room ready to wake up.

Output manifest: brand-imagery/generated/sequences/videos/transitions-manifest.json
"""
import json, base64, urllib.request, urllib.error, os, sys, io
from PIL import Image

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
WALKS = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'walks')
ROOMS = os.path.join(ROOT, 'apps', 'portfolio', 'public', 'rooms')

# Pairs: (transition_id, project_N_alive_hero, project_N_plus_1_empty_start, prompt)
TRANSITIONS = [
    ('01-02',
     os.path.join(ROOMS, 'hero-01-hotel.jpg'),
     os.path.join(WALKS, 'walk-02-start.jpg'),
     'Cinematic dissolve transition. Start: a luxury hotel lobby with a fully alive kinetic mirror wall in champagne and bronze. End: a luxury retail boutique with a plain empty back wall, waiting for installation. Mid-transition: soft mint and sky-blue atmospheric haze sweeps the camera through the first scene and emerges into the second. Smooth continuous camera motion. No people. No text. 5 seconds.'),
    ('02-03',
     os.path.join(ROOMS, 'hero-02-retail.jpg'),
     os.path.join(WALKS, 'walk-03-start.jpg'),
     'Cinematic dissolve transition. Start: a retail boutique with a fully alive interactive mirror wall of polished circles. End: an empty mall arcade arena floor at night, lights dim, awaiting installation. Mid-transition: soft pink and lavender atmospheric haze sweeps through, dissolving the boutique and emerging in the arena. Smooth continuous camera motion. No people. 5 seconds.'),
    ('03-04',
     os.path.join(ROOMS, 'hero-03-mall.jpg'),
     os.path.join(WALKS, 'walk-04-start.jpg'),
     'Cinematic dissolve transition. Start: an alive mall game arena with illuminated podiums, magenta light columns, and radiating LED floor lines. End: an empty stadium concourse at golden hour with just a plain white event tent. Mid-transition: soft mint atmospheric haze sweeps through. Smooth continuous camera motion. No people. 5 seconds.'),
    ('04-05',
     os.path.join(ROOMS, 'hero-04-event.jpg'),
     os.path.join(WALKS, 'walk-05-start.jpg'),
     'Cinematic dissolve transition. Start: an alive sports activation pavilion with rippling brass kinetic facade and magenta light column. End: a corporate atrium in Riyadh with a bare empty ceiling, awaiting kinetic installation. Mid-transition: soft lavender and cream atmospheric haze sweeps through. Smooth continuous camera motion. No people. 5 seconds.'),
    ('05-06',
     os.path.join(ROOMS, 'hero-05-corporate.jpg'),
     os.path.join(WALKS, 'walk-06-start.jpg'),
     'Cinematic dissolve transition. Start: a corporate atrium with a fully alive kinetic ceiling of bronze hexagonal tiles in a wave pattern, Riyadh skyline visible. End: a cultural performance hall in AlUla with a plain matte black acoustic ceiling, sandstone walls, empty teak seats. Mid-transition: soft cream and pink atmospheric haze sweeps through. Smooth continuous camera motion. No people. 5 seconds.'),
    ('06-07',
     os.path.join(ROOMS, 'hero-06-cultural.jpg'),
     os.path.join(WALKS, 'walk-07-start.jpg'),
     'Cinematic dissolve transition. Start: a cultural hall in AlUla with an alive kinetic ceiling of bronze and copper segments mid-motion. End: an empty Riyadh waterfront plaza at twilight with no LED screens installed, just bare floor and benches, Riyadh skyline at dusk. Mid-transition: soft magenta atmospheric haze sweeps through. Smooth continuous camera motion. No people. 5 seconds.'),
    ('07-08',
     os.path.join(ROOMS, 'hero-07-restaurant.jpg'),
     os.path.join(WALKS, 'walk-08-start.jpg'),
     'Cinematic dissolve transition. Start: an interactive Riyadh waterfront screen plaza with curved LED screens displaying flowing pastel artwork and magenta floor accents. End: a dark immersive room with plain matte black walls and a single illuminated white pedestal at center, no projection, no haze. Mid-transition: soft sky-blue atmospheric haze sweeps through. Smooth continuous camera motion. No people. 5 seconds.'),
    ('08-09',
     os.path.join(ROOMS, 'hero-08-launch.jpg'),
     os.path.join(WALKS, 'walk-09-start.jpg'),
     'Cinematic dissolve transition. Start: a 360-degree immersive room with full pastel projection wrapping all walls and ceiling. End: an aerial twilight view of the Riyadh skyline with no magenta beacons, just normal city lights. Mid-transition: the projection pulls outward and breaks into pastel atmospheric haze that disperses into the open sky as we rise. Smooth continuous outward camera pull. No people. 5 seconds.'),
]


def downsample_to_b64(path, max_w=1280):
    img = Image.open(path).convert('RGB')
    img.thumbnail((max_w, 720), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=88, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def submit(tid, start_path, end_path, prompt):
    if not os.path.exists(start_path) or not os.path.exists(end_path):
        return tid, None, f'missing {start_path} or {end_path}'
    body = json.dumps({
        'prompt': prompt,
        'image_url': f'data:image/jpeg;base64,{downsample_to_b64(start_path)}',
        'tail_image_url': f'data:image/jpeg;base64,{downsample_to_b64(end_path)}',
        'duration': '5',
        'aspect_ratio': '16:9',
        'negative_prompt': 'blurry, low quality, people, hands, faces, fingers, text, watermark, logo, distorted, jarring cut'
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
            return tid, data.get('request_id'), data.get('status_url')
    except urllib.error.HTTPError as e:
        return tid, None, f'ERROR {e.code}: {e.read().decode()[:200]}'


manifest = {}
for tid, sp, ep, prompt in TRANSITIONS:
    n, rid, status_url = submit(tid, sp, ep, prompt)
    manifest[tid] = {'request_id': rid, 'status_url': status_url}
    print(f'transition-{tid}: rid={rid}')

out = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'transitions-manifest.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)
print(f'manifest -> {out}')
