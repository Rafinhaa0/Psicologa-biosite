const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};
const compressible = new Set([".css", ".html", ".js", ".svg"]);

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(root, relativePath);
  const isInsideRoot = filePath.toLowerCase().startsWith(`${root.toLowerCase()}${path.sep}`);
  if (!isInsideRoot) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const canCompress = compressible.has(extension);
    const acceptedEncodings = request.headers["accept-encoding"] ?? "";
    const contentEncoding = canCompress && acceptedEncodings.includes("br")
      ? "br"
      : canCompress && acceptedEncodings.includes("gzip")
        ? "gzip"
        : null;
    const headers = {
      "Content-Type": types[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    };
    if (canCompress) headers.Vary = "Accept-Encoding";
    if (contentEncoding) headers["Content-Encoding"] = contentEncoding;
    else headers["Content-Length"] = stats.size;

    response.writeHead(200, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const fileStream = fs.createReadStream(filePath);
    const compressionStream = contentEncoding === "br"
      ? zlib.createBrotliCompress()
      : contentEncoding === "gzip"
        ? zlib.createGzip()
        : null;
    if (compressionStream) fileStream.pipe(compressionStream).pipe(response);
    else fileStream.pipe(response);
  });
}).listen(8000, "127.0.0.1");
