# 机场问题库视觉与功能验收

## 验收范围

- 页面：`/faq/`
- 桌面端：1264 × 900
- 手机端：390 × 844
- 参考页面：机场查问题库的分类、问答折叠和侧边目录结构

## 视觉检查

- 页面延续机场库现有蓝色、浅灰背景、圆角卡片和中文字体体系。
- 首屏明确展示页面用途、24 个问题和 8 个分类，信息层级清晰。
- 桌面端使用主问答区与粘性分类目录的双栏结构。
- 手机端隐藏侧边目录，分类改为横向滑动标签，正文保持单栏。
- 折叠项有原生展开标记，展开状态使用蓝色标题与浅色背景区分。
- 页面无横向溢出，桌面端和手机端未发现遮挡、裁切或异常间距。

## 功能检查

- 24 个问题均由独立 Markdown 内容项生成，可在后台单独新增、编辑、分类和排序。
- 分类标签锚点跳转正常。
- 问答展开与收起正常，可同时展开多个答案。
- 首页、机场详情页、顶部导航和页脚均已接入问题库入口。
- CTA 分别连接机场库、软件下载、机场对比和选购指南。

## SEO 与技术检查

- Hugo 正式构建通过，无 SEO 长度警告。
- 页面标题满足 50–60 字符规则，Meta Description 为 159 个字符。
- Canonical 指向 `https://jichangku.com/faq/`。
- 输出 BreadcrumbList 与 FAQPage 结构化数据，包含 24 个 Question。
- 问题内容只聚合在问题库首页，不生成 24 个薄内容详情页。
- 浏览器控制台无错误或警告。

## 对照材料

- `audit-faq-reference-20260811/01-faq-overview.png`
- `design-qa-faq-20260811/implementation-desktop.png`
- `design-qa-faq-20260811/implementation-mobile-hero.png`
- `design-qa-faq-20260811/implementation-mobile.png`
- `design-qa-faq-20260811/comparison-side-by-side.png`

final result: passed
