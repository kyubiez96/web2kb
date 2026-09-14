// R2 helpers: store articles as JSON at articles/{id}.json. Library index
// is derived from R2 list — no separate index file to keep in sync.

const PREFIX = "articles/";
const MAX_LIST = 200;

export async function putArticle(bucket, article) {
  const key = `${PREFIX}${article.id}.json`;
  await bucket.put(key, JSON.stringify(article), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function getArticle(bucket, id) {
  const obj = await bucket.get(`${PREFIX}${id}.json`);
  if (!obj) return null;
  return JSON.parse(await obj.text());
}

export async function listLibrary(bucket) {
  const out = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: PREFIX, cursor, limit: 100 });
    for (const obj of page.objects) {
      const id = obj.key.slice(PREFIX.length, -".json".length);
      const head = await bucket.head(obj.key);
      const meta = head?.customMetadata ?? {};
      out.push({
        id,
        title: meta.title || id,
        summary: meta.summary || "",
        source_url: meta.source_url || "",
        saved_at: Number(meta.saved_at) || 0,
      });
    }
    cursor = page.truncated ? page.cursor : null;
    if (out.length >= MAX_LIST) break;
  } while (cursor);

  out.sort((a, b) => b.saved_at - a.saved_at);
  return out;
}

// ponytail: writes article body via put, then patches customMetadata so
// /library doesn't need to fetch every object body. Two writes, but reads
// stay O(n) with no full-object parse.
export async function writeWithMetadata(bucket, article) {
  const key = `${PREFIX}${article.id}.json`;
  await bucket.put(key, JSON.stringify(article), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: {
      title: (article.title || "").slice(0, 256),
      summary: (article.summary || "").slice(0, 512),
      source_url: (article.source_url || "").slice(0, 512),
      saved_at: String(article.saved_at || 0),
    },
  });
}
