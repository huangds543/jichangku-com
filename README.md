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
