"""Poll all 8 transition Kling jobs, download MP4s, and extract frames into
apps/portfolio/public/frames/transition-NN-NN/frame-NNN.webp at HD WebP q90."""
import json, os, sys, time, urllib.request, urllib.error, subprocess

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
MANIFEST = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'transitions-manifest.json')
VIDEOS = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos')
FRAMES = os.path.join(ROOT, 'apps', 'portfolio', 'public', 'frames')
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
print(f'[transitions] polling {len(remaining)} jobs in parallel rotation', flush=True)
last_log = 0
while remaining and time.time() < deadline:
    for tid in list(remaining):
        rec = manifest[tid]
        if not rec.get('status_url'):
            errors[tid] = 'no status_url'
            remaining.discard(tid)
            continue
        try:
            s = get(rec['status_url'])
        except Exception as e:
            print(f'[transitions] {tid} status err {e}', flush=True)
            continue
        st = s.get('status')
        if st == 'COMPLETED':
            response_url = rec['status_url'].rsplit('/status', 1)[0]
            try:
                result = get(response_url)
                v = result.get('video') or {}
                vurl = v.get('url') if isinstance(v, dict) else v
                if not vurl:
                    errors[tid] = 'no video url'
                else:
                    done[tid] = vurl
                    print(f'[transitions] {tid} COMPLETED', flush=True)
            except Exception as e:
                errors[tid] = f'fetch result: {e}'
            remaining.discard(tid)
        elif st in ('FAILED', 'CANCELLED'):
            errors[tid] = f'status {st}'
            remaining.discard(tid)
    if remaining and time.time() - last_log > 20:
        print(f'[transitions] still pending: {sorted(remaining)}', flush=True)
        last_log = time.time()
    if remaining:
        time.sleep(8)

if errors:
    print('[transitions] errors:', errors, file=sys.stderr, flush=True)

for tid, vurl in done.items():
    mp4 = os.path.join(VIDEOS, f'transition-{tid}.mp4')
    print(f'[transitions] {tid} downloading -> {mp4}', flush=True)
    with urllib.request.urlopen(vurl, timeout=300) as r, open(mp4, 'wb') as f:
        while c := r.read(1 << 16):
            f.write(c)
    out_dir = os.path.join(FRAMES, f'transition-{tid}')
    os.makedirs(out_dir, exist_ok=True)
    for fn in os.listdir(out_dir):
        if fn.startswith('frame-') and fn.endswith('.webp'):
            os.remove(os.path.join(out_dir, fn))
    cmd = [FFMPEG, '-y', '-i', mp4, '-vsync', '0', '-vf', 'fps=24',
           '-c:v', 'libwebp', '-quality', '90', '-compression_level', '4',
           os.path.join(out_dir, 'frame-%03d.webp')]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    n = sum(1 for fn in os.listdir(out_dir) if fn.startswith('frame-') and fn.endswith('.webp'))
    print(f'[transitions] {tid} extracted {n} frames -> {out_dir}', flush=True)

print(f'[transitions] done. completed={len(done)}, errors={len(errors)}', flush=True)
