"""Phase 2d/2e: poll all 13 Kling jobs, download MP4s, extract 121 webp
frames per phase into assets/projects/{phaseId}/walk/000.webp..120.webp
at 1928x1072 q90 (HD).
"""
import json, os, sys, time, urllib.request, subprocess

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JOBS = os.path.join(ROOT, 'pipeline', 'jobs.jsonl')
VIDEOS = os.path.join(ROOT, 'pipeline', 'videos')
ASSETS = os.path.join(ROOT, 'assets', 'projects')
FFMPEG = r"C:\Users\enaby\OneDrive\سطح المكتب\node_modules\ffmpeg-static\ffmpeg.exe"

os.makedirs(VIDEOS, exist_ok=True)


def get(url):
    req = urllib.request.Request(url, headers={'Authorization': f'Key {KEY}'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


jobs = []
with open(JOBS, encoding='utf-8') as f:
    for line in f:
        jobs.append(json.loads(line))

remaining = {j['phaseId']: j for j in jobs if j.get('status_url')}
done = {}
errors = {}
deadline = time.time() + 1800
print(f'extract-phase2: polling {len(remaining)} jobs', flush=True)
last_log = 0

while remaining and time.time() < deadline:
    for pid in list(remaining):
        rec = remaining[pid]
        try:
            s = get(rec['status_url'])
        except Exception as e:
            print(f'{pid} status err {e}', flush=True)
            continue
        st = s.get('status')
        if st == 'COMPLETED':
            response_url = rec['status_url'].rsplit('/status', 1)[0]
            try:
                result = get(response_url)
                v = result.get('video') or {}
                vurl = v.get('url') if isinstance(v, dict) else v
                if vurl:
                    done[pid] = vurl
                    print(f'{pid} COMPLETED', flush=True)
                else:
                    errors[pid] = 'no video url'
            except Exception as e:
                errors[pid] = f'fetch result: {e}'
            del remaining[pid]
        elif st in ('FAILED', 'CANCELLED'):
            errors[pid] = f'status {st}'
            del remaining[pid]
    if remaining and time.time() - last_log > 30:
        print(f'still pending: {sorted(remaining)}', flush=True)
        last_log = time.time()
    if remaining:
        time.sleep(8)

if errors:
    print('errors:', errors, file=sys.stderr, flush=True)

# Download + extract
for pid, vurl in done.items():
    mp4 = os.path.join(VIDEOS, f'{pid}.mp4')
    print(f'{pid} downloading -> {mp4}', flush=True)
    with urllib.request.urlopen(vurl, timeout=300) as r, open(mp4, 'wb') as f:
        while c := r.read(1 << 16):
            f.write(c)
    out_dir = os.path.join(ASSETS, pid, 'walk')
    os.makedirs(out_dir, exist_ok=True)
    for fn in os.listdir(out_dir):
        if fn.endswith('.webp'):
            os.remove(os.path.join(out_dir, fn))
    cmd = [FFMPEG, '-y', '-i', mp4, '-vsync', '0', '-vf', 'fps=24',
           '-c:v', 'libwebp', '-quality', '90', '-compression_level', '4',
           '-start_number', '0',
           os.path.join(out_dir, '%03d.webp')]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    n = sum(1 for fn in os.listdir(out_dir) if fn.endswith('.webp'))
    print(f'{pid} extracted {n} frames -> {out_dir}', flush=True)

print(f'extract-phase2: done. completed={len(done)} errors={len(errors)}', flush=True)
