#!/usr/bin/env bash
set -Eeuo pipefail

SITE_DIR="${SITE_DIR:-/www/wwwroot/jichangku}"
SITE_URL="${SITE_URL:-https://jichangku.com}"
INDEXNOW_KEY="${INDEXNOW_KEY:-jichangku-indexnow-20260811}"
LOCK_FILE="${LOCK_FILE:-/tmp/jichangku-deploy.lock}"
HUGO_BIN="${HUGO_BIN:-/www/server/hugo-0.161.1/hugo}"
FORCE_BUILD="${FORCE_BUILD:-false}"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "机场库同步任务仍在运行，本次跳过"
  exit 0
fi

cd "$SITE_DIR"

before_commit="$(git rev-parse HEAD)"
git pull --ff-only origin main
after_commit="$(git rev-parse HEAD)"

if [[ "$FORCE_BUILD" != "true" && "$before_commit" == "$after_commit" && -f public/index.html ]]; then
  echo "机场库没有新提交，无需重新构建"
  exit 0
fi

"$HUGO_BIN" --gc --minify --baseURL "${SITE_URL}/"

SITE_URL="$SITE_URL" INDEXNOW_KEY="$INDEXNOW_KEY" node scripts/indexnow-submit.js

echo "机场库同步、构建和 IndexNow 提交完成：$after_commit"
