# Web2KB

Web-to-Knowledge Base. Tempel URL, dapat artikel bersih (markdown), baca di HP.

```
[Android APK (WebView, no secrets)]
        ↓ user-set Worker URL
[Cloudflare Worker]
   ├─ Firecrawl (scrape → markdown)
   ├─ Workers AI (summary, free tier)
   └─ R2 (penyimpanan artikel)
```

## Quick start

### 1. Deploy Worker (1 menit)

```bash
cd worker
npm install
wrangler r2 bucket create web2kb-bucket
wrangler secret put FIRECRAWL_API_KEY   # paste: fc-xxx
wrangler deploy
```

Note URL Worker kamu: `https://web2kb.<your-subdomain>.workers.dev`

### 2. Pasang APK

Download dari [Releases](../../releases) → `web2kb-v0.1.0.apk`.

Buka app → Settings → paste Worker URL → Test → Simpan.

### 3. Pakai

Tambah URL → tunggu ~10 detik → baca di Library.

## Untuk developer / kontributor

Build APK dengan Worker URL custom:

1. Fork repo ini
2. Add secret `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` di Settings → Secrets
3. Actions → "Build APK" → Run workflow → masukkan Worker URL kamu → download artifact

## Arsitektur

- `worker/` — Cloudflare Worker (Hono + R2 + Workers AI + Firecrawl)
- `apk/` — Android WebView shell (Kotlin, no AndroidX)
- `.github/workflows/` — CI/CD

## Quota gratis

| Layanan | Batas | Cukup untuk |
|---|---|---|
| Cloudflare Workers | 100k req/day | ✔ |
| R2 | 10 GB, 1M reads/mo | ✔ |
| Workers AI (bart-large-cnn) | ~10k neurons/day | ✔ hemat |
| Firecrawl | 500 credits/mo | ~500 scrape |

Workers AI merangkum otomatis saat save. Cache 24 jam per artikel. Kalau gagal, artikel tetap tersimpan tanpa summary.

## Privacy

- API key Firecrawl hanya di Worker secrets (server-side).
- Setiap user deploy Worker sendiri + isi key sendiri. APK publik tidak punya key.
- Artikel tersimpan di R2 bucket milik deployer Worker.

## Lisensi

MIT.
