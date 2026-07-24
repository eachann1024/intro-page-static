import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

// Vite builds the static site into dist/client for Sites ASSETS.
// Keep only the worker entry + hosting metadata at dist root.
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

for (const stale of ["dist/assets", "dist/index.html"]) {
  if (existsSync(stale)) {
    await rm(stale, { recursive: true, force: true });
  }
}

await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    if (!env?.ASSETS?.fetch) {
      return new Response("Site assets binding unavailable", { status: 503 });
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    if (request.method !== "GET" || !request.headers.get("accept")?.includes("text/html")) {
      return response;
    }
    const url = new URL(request.url);
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`,
  "utf8",
);
