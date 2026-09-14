// Firecrawl REST client — POST /v1/scrape, returns { markdown, metadata }.

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v1";

export async function scrape(url, apiKey) {
  const res = await fetch(`${FIRECRAWL_BASE}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firecrawl ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(`Firecrawl error: ${JSON.stringify(json).slice(0, 200)}`);
  }

  const data = json.data ?? {};
  return {
    markdown: data.markdown ?? "",
    title:
      data.metadata?.title ||
      data.metadata?.ogTitle ||
      new URL(url).hostname,
    description: data.metadata?.description || "",
    sourceUrl: data.metadata?.sourceURL || data.metadata?.url || url,
  };
}
