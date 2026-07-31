import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const routes = new Map([
  ["/", "Complex Systems Product Designer"],
  ["/work/harbinger", "The interface looked simple"],
  ["/work/harbinger/v2", "The interface looked simple"],
  ["/work/harbinger/documentation", "Roles, rules, workflows and product decisions"],
  ["/work/aadivara", "Connecting accessible candidate journeys"],
  ["/work/inventfunds", "Connecting people who build ideas"],
  ["/work/property-care", "Connecting property discovery"],
  ["/work/hcm-cafe", "Designing clear operational workspaces"],
  ["/concepts", "Compare all four live concepts"],
]);

let workerPromise;

function loadWorker() {
  if (!workerPromise) {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
    workerPromise = import(workerUrl.href).then(({ default: worker }) => worker);
  }
  return workerPromise;
}

async function renderRoute(route) {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request(`http://localhost${route}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  return { response, html: await response.text() };
}

test("renders every portfolio route without an error shell", async () => {
  for (const [route, expectedContent] of routes) {
    const { response, html } = await renderRoute(route);
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
      `${route} should return HTML`,
    );
    assert.match(html, developmentPreviewMeta, `${route} should include preview metadata`);
    assert.ok(html.includes(expectedContent), `${route} should include its page identity`);
    assert.doesNotMatch(html, /nextjs-container-errors|vite-error-overlay|Internal Server Error/i);
  }
});

test("all internal page links, section targets and public images resolve", async () => {
  const rendered = new Map();
  for (const route of routes.keys()) {
    rendered.set(route, (await renderRoute(route)).html);
  }

  const routeLinks = new Set();
  const assetLinks = new Set();
  const fragmentLinks = [];

  for (const [sourceRoute, html] of rendered) {
    for (const match of html.matchAll(/\b(?:href|src)=["']([^"'?#]+)(?:\?[^"'#]*)?(#[^"']+)?["']/g)) {
      const [, pathname, hash = ""] = match;
      if (!pathname.startsWith("/")) continue;
      if (pathname.startsWith("/assets/")) continue;

      if (/\.[a-z0-9]{2,5}$/i.test(pathname)) {
        assetLinks.add(pathname);
        continue;
      }

      routeLinks.add(pathname);
      if (hash) fragmentLinks.push({ sourceRoute, pathname, id: hash.slice(1) });
    }
  }

  for (const route of routeLinks) {
    const { response } = await renderRoute(route);
    assert.equal(response.status, 200, `Internal link ${route} should resolve`);
  }

  for (const { sourceRoute, pathname, id } of fragmentLinks) {
    const targetHtml = rendered.get(pathname) ?? (await renderRoute(pathname)).html;
    assert.match(
      targetHtml,
      new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`),
      `${sourceRoute} links to missing target ${pathname}#${id}`,
    );
  }

  for (const assetPath of assetLinks) {
    const localAsset = new URL(`../public${assetPath}`, import.meta.url);
    await assert.doesNotReject(
      access(localAsset),
      `Referenced asset ${assetPath} should exist in public`,
    );
  }
});

test("case studies use consistent project labels and global contact actions", async () => {
  const caseRoutes = [...routes.keys()].filter((route) => route.startsWith("/work/"));

  for (const route of caseRoutes) {
    const { html } = await renderRoute(route);
    assert.ok(html.includes("Contact"), `${route} should provide a Contact action`);
    assert.ok(html.includes("Résumé"), `${route} should provide a résumé download`);
  }

  for (const route of caseRoutes.filter((route) => !route.endsWith("/documentation"))) {
    const { html } = await renderRoute(route);
    assert.ok(html.includes("Product case study"), `${route} should use the shared case-study label`);
  }
});
