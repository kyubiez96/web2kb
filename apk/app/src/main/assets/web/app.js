// web2kb shared utilities. Loaded on every page via <script src="config.js">
// then <script src="app.js">. No bundler, no framework.

const WORKER_URL_KEY = "worker_url";

function getWorkerUrl() {
  return (localStorage.getItem(WORKER_URL_KEY) || window.WEB2KB_WORKER_URL || "").trim();
}

function setWorkerUrl(url) {
  localStorage.setItem(WORKER_URL_KEY, url.trim());
}

async function api(path, opts = {}) {
  const base = getWorkerUrl();
  if (!base) throw new Error("Worker URL belum diset. Buka Settings dulu.");
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText;
    throw new Error(`${res.status}: ${msg}`);
  }
  return data;
}

// Tiny markdown renderer. Good enough for clean Firecrawl markdown
// (headings, paragraphs, lists, links, bold, code). No external dep.
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderMarkdown(md) {
  if (!md) return "";
  const lines = md.split(/\r?\n/);
  const out = [];
  let inList = false;
  let inCode = false;
  let buf = [];

  const flushPara = () => {
    if (buf.length) {
      out.push("<p>" + inline(buf.join(" ")) + "</p>");
      buf = [];
    }
  };

  const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };

  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    s = s.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  for (const line of lines) {
    if (/^```/.test(line)) { inCode = !inCode; out.push(inCode ? "<pre><code>" : "</code></pre>"); continue; }
    if (inCode) { out.push(escapeHtml(line)); continue; }
    if (/^#{1,6}\s+/.test(line)) {
      flushPara(); closeList();
      const level = line.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(line.replace(/^#+\s*/, ""))}</h${level}>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push("<li>" + inline(line.replace(/^\s*[-*]\s+/, "")) + "</li>");
      continue;
    }
    if (!line.trim()) { flushPara(); closeList(); continue; }
    buf.push(line);
  }
  flushPara(); closeList();
  return out.join("\n");
}

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toast(msg, kind = "info") {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "fixed bottom-4 left-4 right-4 px-4 py-3 rounded-lg shadow-lg text-center text-sm z-50 transition-opacity";
    document.body.appendChild(el);
  }
  el.className = `fixed bottom-4 left-4 right-4 px-4 py-3 rounded-lg shadow-lg text-center text-sm z-50 ${kind === "error" ? "bg-red-600 text-white" : "bg-slate-800 text-white"}`;
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = "0"; }, 3000);
}

function nav(html) {
  return `
    <nav class="sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3 z-10">
      <a href="library.html" class="font-semibold text-lg">📚 web2kb</a>
      <div class="flex-1"></div>
      <a href="add.html" class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md">+ Tambah</a>
      <a href="settings.html" class="text-sm text-slate-600 dark:text-slate-300 px-2">⚙</a>
    </nav>`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Auto dark mode from system
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
});
