import { Hono } from "hono";
import { scrape } from "./firecrawl.js";
import { summarize, cacheTimestamp } from "./ai.js";
import { putArticle, getArticle, listLibrary, writeWithMetadata } from "./r2.js";

const app = new Hono();

app.get("/health", (c) =>
  c.json({ ok: true, version: "0.1.0", ts: Date.now() })
);

app.get("/library", async (c) => {
  const items = await listLibrary(c.env.WEB2KB_BUCKET);
  return c.json({ items });
});

app.get("/article/:id", async (c) => {
  const article = await getArticle(c.env.WEB2KB_BUCKET, c.req.param("id"));
  if (!article) return c.json({ error: "not_found" }, 404);
  return c.json(article);
});

app.post("/scrape", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }

  const url = (body?.url || "").trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    return c.json({ error: "invalid_url" }, 400);
  }

  try {
    const scraped = await scrape(url, c.env.FIRECRAWL_API_KEY);
    const id = crypto.randomUUID();
    const summary = await summarize(c.env, scraped.markdown, null);

    const article = {
      id,
      url,
      title: scraped.title,
      source_url: scraped.sourceUrl,
      summary,
      summary_cached_at: cacheTimestamp(),
      markdown: scraped.markdown,
      saved_at: Date.now(),
    };

    await writeWithMetadata(c.env.WEB2KB_BUCKET, article);

    return c.json({
      id,
      title: article.title,
      summary: article.summary,
      source_url: article.source_url,
      saved_at: article.saved_at,
    });
  } catch (err) {
    return c.json({ error: "scrape_failed", message: err.message }, 502);
  }
});

app.notFound((c) => c.json({ error: "not_found" }, 404));

export default app;
