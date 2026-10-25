"use strict";

const { createServer } = require("node:http");
const { readFile, stat } = require("node:fs/promises");
const path = require("node:path");

const rootDirectory = __dirname;
const port = Number(process.env.PORT || 8080);
const publicFiles = new Set([
  "index.html",
  "app.js",
  "styles.css",
  "README.md",
  "RELEASE_NOTES.md",
  "LICENSE",
  "docs/ARCHITECTURE-STANDARDS.md",
  "docs/DECISION-RECORDS.md"
]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function sendText(response, statusCode, message, method = "GET") {
  const body = Buffer.from(message);
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": body.length,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });
  response.end(method === "HEAD" ? undefined : body);
}

async function handleRequest(request, response) {
  const method = request.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendText(response, 405, "Method Not Allowed", method);
    return;
  }

  let requestUrl;
  let pathname;
  try {
    requestUrl = new URL(request.url || "/", "http://localhost");
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    sendText(response, 400, "Bad Request", method);
    return;
  }

  if (pathname === "/healthz") {
    const body = Buffer.from(JSON.stringify({ status: "ok" }));
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": body.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });
    response.end(method === "HEAD" ? undefined : body);
    return;
  }

  if (pathname === "/") pathname = "/index.html";
  const relativePath = pathname.slice(1).replace(/\\/g, "/");
  if (relativePath.split("/").some((segment) => !segment || segment.startsWith(".")) || !publicFiles.has(relativePath)) {
    sendText(response, 404, "Not Found", method);
    return;
  }

  const filePath = path.resolve(rootDirectory, relativePath);
  const resolvedRelativePath = path.relative(rootDirectory, filePath);
  if (resolvedRelativePath.startsWith("..") || path.isAbsolute(resolvedRelativePath)) {
    sendText(response, 404, "Not Found", method);
    return;
  }

  try {
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) {
      sendText(response, 404, "Not Found", method);
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": relativePath === "index.html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });
    response.end(method === "HEAD" ? undefined : body);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      sendText(response, 404, "Not Found", method);
      return;
    }
    console.error(`Failed to serve ${relativePath}:`, error);
    sendText(response, 500, "Internal Server Error", method);
  }
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid PORT value: ${process.env.PORT}`);
  process.exit(1);
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error("Unhandled request error:", error);
    if (!response.headersSent) sendText(response, 500, "Internal Server Error", request.method);
    else response.destroy(error);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Archway Studio listening on 0.0.0.0:${port}`);
});

server.on("error", (error) => {
  console.error("HTTP server failed:", error);
  process.exitCode = 1;
});
