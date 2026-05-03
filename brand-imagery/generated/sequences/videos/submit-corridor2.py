"""Submit corridor2 keyframes to Kling 2.1 Master via Fal.ai."""
import json, base64, urllib.request, urllib.error, sys, os
from PIL import Image
import io

KEY = "04c19585-8a4e-4e6d-8234-6d07eb1fd223:ac19e216f68e6b380300bc31efa569a9"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
START = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'corridor2', 'corridor2-start.jpg')
END   = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'corridor2', 'corridor2-end.jpg')

def downsample_to_b64(path, max_w=1280):
    img = Image.open(path).convert('RGB')
    img.thumbnail((max_w, 720), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=88, optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

start_b64 = downsample_to_b64(START)
end_b64   = downsample_to_b64(END)

prompt = (
    "First-person walk-through of a serene minimalist corridor with translucent "
    "stacked-layer pastel glass walls. Smooth continuous forward motion at a steady pace. "
    "At the far end, the pair of frameless doors gently part, revealing soft pastel light "
    "pouring through. Cinematic architectural cinematography, calm pace, James Turrell "
    "light installation precision. No people, no text, no logos."
)

body = json.dumps({
    "prompt": prompt,
    "image_url": f"data:image/jpeg;base64,{start_b64}",
    "tail_image_url": f"data:image/jpeg;base64,{end_b64}",
    "duration": "5",
    "aspect_ratio": "16:9",
    "negative_prompt": "blurry, low quality, people, hands, faces, text, watermark, logo"
}).encode()

req = urllib.request.Request(
    "https://queue.fal.run/fal-ai/kling-video/v2.1/master/image-to-video",
    data=body,
    headers={
        "Authorization": f"Key {KEY}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req, timeout=120) as resp:
    data = json.loads(resp.read().decode())
    print(json.dumps(data, indent=2))
    out = os.path.join(ROOT, 'brand-imagery', 'generated', 'sequences', 'videos', 'corridor2.submission.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
