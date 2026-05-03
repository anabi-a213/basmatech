"""Phase 2c: submit 13 fresh Kling 2.1 Master jobs in parallel.

Inputs per phaseId:
  assets/projects/{phaseId}/walk-start.jpg
  assets/projects/{phaseId}/hero.jpg

Endpoint: fal-ai/kling-video/v2.1/master/image-to-video
Per job: duration "5", aspect_ratio "16:9", negative prompt from
pipeline/prompts/negative.txt.

Hard $60 cap. Estimator runs first.
Output manifest: pipeline/jobs.jsonl (request_id, status_url per phase).
"""
import json, base64, urllib.request, urllib.error, os, sys, io
from PIL import Image

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(ROOT, 'assets', 'projects')
NEG = open(os.path.join(ROOT, 'pipeline', 'prompts', 'negative.txt'), encoding='utf-8').read()

PHASES = [
    ('tour-01-hotel-jeddah',
     'Smooth cinematic camera push-in toward the back wall of a luxury Red Sea hotel lobby in Jeddah. As we approach, a 9-meter wide kinetic mirror wall composed of 312 hexagonal champagne-bronze tiles materialises and comes alive. Tiles tilt independently catching warm afternoon light, forming a slow diagonal wave. Single magenta line traces the floor seam. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-02-retail-riyadh',
     'Smooth cinematic camera push-in toward the back wall of a luxury retail flagship in Riyadh. As we approach, a 7-meter interactive mirror wall of 256 polished circular brass-edged mirrors materialises and comes alive, mirrors tilting in a fractured pixelated pattern. A hairline magenta neon line traces the floor seam from entrance to back wall. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-03-arena-dammam',
     'Smooth cinematic camera push-in across an empty competitive game arena floor in a Dammam mall. As we approach, the 540 pressure-sensing tiles ignite in waves of soft pastel light forming an active competitive grid, two team scoring podiums emerge with vertical 4-meter magenta light columns rising at opposite ends, surrounding wall LED panels switch on showing abstract supporter graphics. Embedded floor LED line strips radiate outward. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-04-stadium-riyadh',
     'Smooth cinematic camera push-in toward an empty plaza at a Riyadh stadium concourse during golden hour. As we approach, a clean rectangular brass-louvered architectural pavilion materialises with a precise vertical-slat facade casting parallel shadow lines on the polished concrete plaza, a vertical magenta light column ignites visible through the central doorway-portal. Smooth continuous forward motion. Stadium tiered seating crowd softly defocused behind. NO PEOPLE in foreground.'),
    ('tour-05-atrium-riyadh',
     'Smooth cinematic camera push-in into the grand atrium of an energy company in Riyadh. As we move forward, a horizontal kinetic ceiling installation of 220 hexagonal hand-rubbed brass-and-bronze tiles materialises overhead and comes alive in a slow flowing wave pattern, catching natural light from the glass roof above. Riyadh skyline visible through tall windows. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-06-cultural-alula',
     'Smooth cinematic camera push-in toward the center of a cultural performance hall in AlUla. As we approach, 96 long bronze-and-copper rectangular ceiling segments materialise and begin moving in synchrony, forming a flowing wave pattern overhead. Warm uplighting from the floor casts dramatic elongated shadows. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-07-plaza-riyadh',
     'Smooth cinematic camera push-in along a Riyadh waterfront plaza at twilight. As we move forward parallel to the restaurant terraces, the continuous curved LED screen wall above the storefronts illuminates and comes alive: pastel gradient motion in mint, sky blue, lavender, pink, magenta flowing as one composition. Embedded floor LED magenta lines glow and pulse in waves. Atmospheric haze. Smooth continuous forward motion. NO PEOPLE focus.'),
    ('tour-08-immersive-riyadh',
     'Smooth cinematic camera push-in into a dark immersive product launch room in Riyadh. As we move forward toward the central pedestal, the 360-degree projection on all four walls and ceiling ignites and comes alive: flowing pastel liquid abstract imagery in mint, sky blue, lavender, pink, magenta swirls wraps the entire room. Atmospheric haze appears. Polished black basalt floor mirrors the projection. Smooth continuous forward motion. NO PEOPLE.'),
    ('tour-09-operations',
     'Slow aerial pull-back over a Riyadh cityscape at twilight. As the camera rises, 9 magenta beacons light up one by one across the city marking 9 installations, and faint magenta connection lines arc gracefully between them, revealing the network like a constellation. Smooth continuous aerial pull-back motion. Atmospheric.'),
    ('home-c2-imprint',
     'Cinematic moment: a single point of magenta light at center of a soft pastel cream field slowly expands and crystallises into a hexagonal mirror tile that gracefully materialises and rotates into focus, settling at center frame in polished champagne-bronze with brass facets. Three faint translucent stacked-layer wisps in soft mint, sky blue, and pastel pink emerge to form a gentle halo around the tile. Smooth liquid emergence. Calm museum-specimen atmosphere. NO PEOPLE.'),
    ('home-c3-workshop',
     'Top-down workshop bench camera, smooth time-lapse mechanical assembly. Scattered components — 8 hexagonal champagne-bronze mirror tiles, NEMA17 stepper motors, a green PCB controller, ribbon cables, brass hex bolts, aluminum brackets — slide together and assemble themselves around each tile, joining into a complete kinetic wall module section. The brass "RIYADH WORKSHOP" plate visible. Smooth precise mechanical motion. NO PEOPLE, NO HANDS.'),
    ('home-c4-motion',
     'Wide architectural shot of a luxury Saudi corporate atrium. The kinetic wall on the back wall awakens: 312 hexagonal champagne-bronze tiles begin to tilt in sequence, forming a graceful diagonal wave pattern across the wall. Each tile catches reflected late-afternoon Riyadh light. Smooth continuous tilting motion. NO PEOPLE.'),
    ('home-c5-kingdom',
     'Aerial pull-back over the Saudi Arabian peninsula at twilight. As the camera rises, 6 magenta beacons light up one by one across the kingdom — Riyadh first (brightest, central), then Jeddah, NEOM, AlUla, Red Sea, Dammam. Faint magenta connection lines arc gracefully between cities, completing a unified network like a constellation. Atmospheric haze and twilight transition.'),
]

COST_PER = 2.50
HARD_CAP = 60.0


def b64(path, max_w=1280):
    img = Image.open(path).convert('RGB')
    img.thumbnail((max_w, 720), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=88, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def submit(phase_id, prompt):
    start_path = os.path.join(ASSETS, phase_id, 'walk-start.jpg')
    end_path = os.path.join(ASSETS, phase_id, 'hero.jpg')
    if not os.path.exists(start_path) or not os.path.exists(end_path):
        return phase_id, None, f'missing {start_path} or {end_path}'
    body = json.dumps({
        'prompt': prompt,
        'image_url': f'data:image/jpeg;base64,{b64(start_path)}',
        'tail_image_url': f'data:image/jpeg;base64,{b64(end_path)}',
        'duration': '5',
        'aspect_ratio': '16:9',
        'negative_prompt': NEG,
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
            return phase_id, data.get('request_id'), data.get('status_url')
    except urllib.error.HTTPError as e:
        return phase_id, None, f'ERROR {e.code}: {e.read().decode()[:300]}'


def main():
    estimate = len(PHASES) * COST_PER
    print(f'Phase 2c estimator: {len(PHASES)} jobs at ${COST_PER:.2f} = ${estimate:.2f}', flush=True)
    if estimate > HARD_CAP:
        print(f'ABORT: estimate ${estimate:.2f} > hard cap ${HARD_CAP:.2f}', file=sys.stderr)
        sys.exit(2)

    manifest = {}
    for phase_id, prompt in PHASES:
        pid, rid, status_url = submit(phase_id, prompt)
        manifest[pid] = {'request_id': rid, 'status_url': status_url}
        print(f'{pid}: rid={rid}', flush=True)

    out = os.path.join(ROOT, 'pipeline', 'jobs.jsonl')
    with open(out, 'w', encoding='utf-8') as f:
        for pid, rec in manifest.items():
            f.write(json.dumps({'phaseId': pid, **rec}) + '\n')
    print(f'manifest -> {out}')


main()
