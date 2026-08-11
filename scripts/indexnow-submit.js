const fs = require("fs");
const path = require("path");
const https = require("https");

const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sitemapPath = process.env.SITEMAP_PATH || path.join(publicDir, "sitemap.xml");
const endpoint = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const key = (process.env.INDEXNOW_KEY || "").trim();

function readSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");

  for (const filename of ["hugo.yaml", "config.yaml"]) {
    const configPath = path.join(rootDir, filename);
    if (!fs.existsSync(configPath)) continue;
    const config = fs.readFileSync(configPath, "utf8");
    const match = config.match(/^baseURL:\s*["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1].replace(/\/+$/, "");
  }

  return "https://jichangku.com";
}

function extractUrls(xml) {
  const urls = [];
  const pattern = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  let match;
  while ((match = pattern.exec(xml)) !== null) urls.push(match[1].trim());
  return [...new Set(urls)];
}

function normalizeUrls(urls, siteUrl) {
  return urls
    .map((url) => {
      try {
        const parsed = new URL(url);
        return `${siteUrl}${parsed.pathname}${parsed.search}`;
      } catch (_error) {
        return "";
      }
    })
    .filter(Boolean);
}

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const target = new URL(url);
    const request = https.request(
      {
        method: "POST",
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        let responseBody = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => { responseBody += chunk; });
        response.on("end", () => resolve({ statusCode: response.statusCode, body: responseBody }));
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function main() {
  if (!key) throw new Error("Missing INDEXNOW_KEY. Set it before running this script.");
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    throw new Error("INDEXNOW_KEY should contain only letters, numbers, or hyphens.");
  }
  if (!fs.existsSync(sitemapPath)) throw new Error(`Sitemap not found: ${sitemapPath}`);

  const siteUrl = readSiteUrl();
  const host = new URL(siteUrl).hostname;
  const keyFilePath = path.join(publicDir, `${key}.txt`);
  const keyLocation = `${siteUrl}/${key}.txt`;

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(keyFilePath, key, "utf8");

  const xml = fs.readFileSync(sitemapPath, "utf8");
  const urls = normalizeUrls(extractUrls(xml), siteUrl);
  if (!urls.length) throw new Error(`No URLs found in sitemap: ${sitemapPath}`);

  const payload = { host, key, keyLocation, urlList: urls.slice(0, 10000) };
  if (process.env.INDEXNOW_DRY_RUN === "true") {
    console.log(`IndexNow dry run: ${payload.urlList.length} URLs ready for ${endpoint}`);
    return;
  }

  const result = await postJson(endpoint, payload);
  if (![200, 202].includes(result.statusCode)) {
    throw new Error(`IndexNow failed with HTTP ${result.statusCode}: ${result.body}`);
  }

  console.log(`IndexNow submitted ${payload.urlList.length} URLs to ${endpoint}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
