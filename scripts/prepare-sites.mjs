import { copyFile, mkdir, writeFile } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

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
