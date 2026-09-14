# Web2KB

> Paste a URL → clean markdown + AI summary, saved offline.  
> *Tempel URL, dapat artikel bersih, baca di HP.*

[![Build APK](https://github.com/kyubiez96/web2kb/actions/workflows/build-android.yml/badge.svg)](https://github.com/kyubiez96/web2kb/actions/workflows/build-android.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Powered%20by-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

Web2KB turns any article URL into a clean, AI-summarized knowledge entry you can read offline on your phone. No accounts, no trackers — you deploy your own Worker, you keep your own API key.

```
[Android APK (WebView, no secrets)]
        ↓ user-set Worker URL
[Cloudflare Worker (Hono)]
   ├─ Firecrawl (scrape → markdown)
   ├─ Workers AI (summary, free tier)
   └─ R2 (article storage)
```

## Features

- 📥 Paste URL → clean markdown + summary in ~10 seconds
- 📚 Offline library, no network needed after saving
- 🔐 Zero secrets in the APK — BYO (bring your own) Worker
- 🤖 Free-tier Workers AI summaries (bart-large-cnn)
- 📱 Tailwind UI, WebView APK, no AndroidX
- ⚙️ 1-click deploy: 5 minutes from clone to live Worker

## Quick start

### 1. Deploy your Worker (1 minute)

Requires [wrangler](https://developers.cloudflare.com/workers/wrangler/) and a free Cloudflare account.

```bash
cd worker
npm install
wrangler r2 bucket create web2kb-bucket
wrangler secret put FIRECRAWL_API_KEY   # get one at firecrawl.dev (500 free credits)
wrangler deploy
```

Note your Worker URL: `https://web2kb.<your-subdomain>.workers.dev`

### 2. Install the APK

Download `web2kb-v0.1.0.apk` from [Releases](https://github.com/kyubiez96/web2kb/releases).

Open the app → **Settings** → paste your Worker URL → **Test** → **Save**.

### 3. Use it

**Add** a URL → wait ~10 s → read it in your **Library**, offline.

## Build from source

```bash
# Worker
cd worker && npm install && npx wrangler dev

# APK (CI only — the repo's Build APK workflow tags android-v*)
gh workflow run build-android.yml -f worker_url=https://web2kb.<sub>.workers.dev
```

## Stack

Cloudflare Workers · Hono · R2 · Workers AI · Firecrawl · Android (Kotlin, no AndroidX) · Tailwind CSS · GitHub Actions

## License

[MIT](LICENSE) © 2026 Kyubiez96
