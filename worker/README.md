# Deploy your own web2kb Worker in 1 minute.

## 1. Create R2 bucket
```bash
wrangler r2 bucket create web2kb-bucket
```

## 2. Set your Firecrawl API key
Get a free key at https://firecrawl.dev (500 credits/mo).
```bash
wrangler secret put FIRECRAWL_API_KEY
# paste: fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Deploy
```bash
npm install
wrangler deploy
```

After deploy, note your worker URL:
`https://web2kb.<your-cf-subdomain>.workers.dev`

## 4. Open the APK
- Install `web2kb-v0.1.0.apk`
- Open app → Settings → paste Worker URL
- Tap "Test connection" → green check
- Add URL → save → read in Library

## Free tier notes
- Workers: 100k req/day
- R2: 10 GB storage, 1M Class A reads/mo
- Workers AI: ~10k neurons/day (bart-large-cnn)
- Firecrawl: 500 credits/mo
