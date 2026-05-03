"""Poll 4 Site 1 chapter Kling jobs, download MP4s, extract frames into
apps/main/public/frames/chapter-NN/frame-NNN.webp at HD WebP q90."""
import json, os, sys, time, urllib.request, subprocess

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
MANIFEST = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'chapters-manifest.json')
VIDEOS = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos')
FRAMES = os.path.join(ROOT, 'apps', 'main', 'public', 'frames')
FFMPEG = r"C:\Users\enaby\OneDrive\سطح المكتب\node_modules\ffmpeg-static\ffmpeg.exe"

with open(MANIFEST, 'r', encoding='utf-8') as f:
    manifest = json.load(f)


def get(url):
    req = urllib.request.Request(url, headers={'Authorization': f'Key {KEY}'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


remaining = set(manifest.keys())
done = {}
errors = {}
deadline = time.time() + 1200
print(f'[chapters] polling {len(remaining)} jobs', flush=True)
last_log = 0
while remaining and time.time() < deadline:
    for cid in list(remaining):
        rec = manifest[cid]
        if not rec.get('status_url'):
            errors[cid] = 'no status_url'
            remaining.discard(cid)
            continue
        try:
            s = get(rec['status_url'])
        except Exception as e:
            print(f'[chapters] {cid} status err {e}', flush=True)
            continue
        st = s.get('status')
        if st == 'COMPLETED':
            response_url = rec['status_url'].rsplit('/status', 1)[0]
            try:
                result = get(response_url)
                v = result.get('video') or {}
                vurl = v.get('url') if isinstance(v, dict) else v
                if not vurl:
                    errors[cid] = 'no video url'
                else:
                    done[cid] = vurl
                    print(f'[chapters] {cid} COMPLETED', flush=True)
            except Exception as e:
                errors[cid] = f'fetch result: {e}'
            remaining.discard(cid)
        elif st in ('FAILED', 'CANCELLED'):
            errors[cid] = f'status {st}'
            remaining.discard(cid)
    if remaining and time.time() - last_log > 20:
        print(f'[chapters] still pending: {sorted(remaining)}', flush=True)
        last_log = time.time()
    if remaining:
        time.sleep(8)

if errors:
    print('[chapters] errors:', errors, file=sys.stderr, flush=True)

for cid, vurl in done.items():
    mp4 = os.path.join(VIDEOS, f'chapter-{cid}.mp4')
    print(f'[chapters] {cid} downloading -> {mp4}', flush=True)
    with urllib.request.urlopen(vurl, timeout=300) as r, open(mp4, 'wb') as f:
        while c := r.read(1 << 16):
            f.write(c)
    out_dir = os.path.join(FRAMES, f'chapter-{cid}')
    os.makedirs(out_dir, exist_ok=True)
    for fn in os.listdir(out_dir):
        if fn.startswith('frame-') and fn.endswith('.webp'):
            os.remove(os.path.join(out_dir, fn))
    cmd = [FFMPEG, '-y', '-i', mp4, '-vsync', '0', '-vf', 'fps=24',
           '-c:v', 'libwebp', '-quality', '90', '-compression_level', '4',
           os.path.join(out_dir, 'frame-%03d.webp')]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    n = sum(1 for fn in os.listdir(out_dir) if fn.startswith('frame-') and fn.endswith('.webp'))
    print(f'[chapters] {cid} extracted {n} frames -> {out_dir}', flush=True)

print(f'[chapters] done. completed={len(done)}, errors={len(errors)}', flush=True)
