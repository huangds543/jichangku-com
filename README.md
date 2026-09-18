# 机场库正式站

这是机场库的 Hugo + Decap CMS 版本。前台发布为纯静态页面，机场资料、文章、友情链接与首页基础信息均可在 `/admin/` 后台维护。

## 本地预览

```powershell
hugo server -D
npm.cmd run cms
```

打开 `http://127.0.0.1:4174/admin/` 后会直接进入本地后台，不需要 GitHub 登录；保存内容会写回当前项目文件。本地内容代理使用 `8081` 端口。

## 发布前配置

1. 在 `static/admin/config.yml` 中把 `REPLACE_WITH_GITHUB_OWNER/jichangku` 替换为正式 GitHub 仓库。
2. 在 Vercel 配置 `GITHUB_CLIENT_ID` 与 `GITHUB_CLIENT_SECRET`。
3. 把 `data/site.yaml` 中的 `tg_url` 更新为 Telegram 频道链接。
4. 将域名绑定到 `jichangku.com`，构建命令使用 `hugo --gc --minify`，输出目录使用 `public`。

## 内容入口

- 机场：`content/airports/`
- 指南文章：`content/guides/`
- 首页与友情链接：`data/site.yaml`
- 后台配置：`static/admin/config.yml`

## 免费节点每日更新时间

免费节点页面的更新时间由 Hugo 构建时自动生成，并固定使用北京时间。宝塔计划任务每天执行一次下面的命令，即使 GitHub 没有新提交也会强制重新构建，并同步更新站点地图中的免费节点 `lastmod`：

```bash
cd /www/wwwroot/jichangku && FORCE_BUILD=true bash scripts/bt-sync-indexnow.sh
```

建议计划任务每天 `00:10` 执行。
