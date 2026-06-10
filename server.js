const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, { "Content-Type": "text/plain; charset=utf-8" }, "Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const isHtml = ext === ".html";
    send(res, 200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": isHtml ? "no-cache" : "public, max-age=86400"
    }, data);
  });
});

server.listen(PORT, () => {
  console.log(`Estudio Las Gemelas listening on ${PORT}`);
});
