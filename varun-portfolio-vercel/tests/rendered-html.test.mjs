import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const routes = new Map([
  ["/", "I design clarity"],
  ["/work/harbinger", "Designing three connected workflows"],
  ["/work/harbinger/v2", "Designing three connected workflows"],
  ["/work/harbinger/documentation", "Roles, rules, workflows and product decisions"],
  ["/work/aadivara", "Connecting accessible candidate journeys"],
  ["/work/inventfunds", "Connecting people who build ideas"],
  ["/work/property-care", "Connecting property discovery"],
  ["/work/hcm-cafe", "Designing clear operational workspaces"],
  ["/concepts", "Compare all four live concepts"],
  ["/work-with-me", "I take on focused design work"],
]);

let nextProcess;
let baseUrl;

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (nextProcess?.exitCode !== null) throw new Error(`Next server exited with code ${nextProcess?.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for the Next production server");
}

test.before(async () => {
  const port = await getAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  nextProcess = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "ignore",
    windowsHide: true,
  });
  await waitForServer(baseUrl);
});

test.after(() => {
  nextProcess?.kill();
});

async function renderRoute(route) {
  const response = await fetch(`${baseUrl}${route}`, { headers: { accept: "text/html" } });

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
    if (assetPath.startsWith("/_next/")) {
      const response = await fetch(`${baseUrl}${assetPath}`);
      assert.equal(response.status, 200, `Generated asset ${assetPath} should resolve`);
      continue;
    }

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
    assert.ok(html.includes("Resume"), `${route} should provide a resume download`);
  }

  for (const route of caseRoutes.filter((route) => !route.endsWith("/documentation"))) {
    const { html } = await renderRoute(route);
    assert.ok(html.includes("Product case study"), `${route} should use the shared case-study label`);
  }
});

test("freelance conversion path keeps work and hiring actions available", async () => {
  const { html } = await renderRoute("/work-with-me");
  for (const label of ["Start a project", "View my work", "Discuss a quick task", "Discuss a website", "Discuss a product", "More quick design help", "Relevant work", "How a project starts", "Hiring or full-time roles"]) {
    assert.ok(html.includes(label), `/work-with-me should include ${label}`);
  }
  assert.ok(html.includes("Freelance%20project%20enquiry"), "Freelance email should include a project enquiry subject");
});
