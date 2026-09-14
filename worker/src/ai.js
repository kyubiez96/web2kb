// Workers AI summarizer. bart-large-cnn is tuned for summarization.
// ponytail: cache summary in article JSON with cached_at; refresh if older than 24h.

const SUMMARY_CACHE_MS = 24 * 60 * 60 * 1000;
const MAX_INPUT_CHARS = 3000;

export async function summarize(env, markdown, existing) {
  if (existing?.summary && existing?.summary_cached_at) {
    const age = Date.now() - existing.summary_cached_at;
    if (age < SUMMARY_CACHE_MS) return existing.summary;
  }

  if (!markdown?.trim()) return "";

  const trimmed = markdown.slice(0, MAX_INPUT_CHARS);
  const input = trimmed.replace(/\s+/g, " ").trim();

  try {
    const res = await env.AI.run("@cf/facebook/bart-large-cnn", {
      input_text: input,
      max_length: 90,
    });
    const text = res?.summary ?? "";
    return text.trim();
  } catch (err) {
    console.error("Workers AI summarize failed:", err.message);
    return "";
  }
}

export function cacheTimestamp() {
  return Date.now();
}
