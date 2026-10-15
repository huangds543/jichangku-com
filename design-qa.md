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

---

# 首页快速选择卡片修复验收（2026-10-16）

## 对照材料

- Source visual truth：`C:\Users\huang\AppData\Local\Temp\codex-clipboard-7a98030c-e683-44d0-b1a0-1e16b7df8274.png`
- Implementation：Codex 内置浏览器对 `http://127.0.0.1:4173/qa-quick-panel.html` 的桌面端视口截图（本次任务工具输出中已显示）
- 浏览器视口：1280 × 720 CSS px，deviceScaleFactor 1
- 源图：1907 × 1164 px；实现截图：1280 × 720 px
- 状态：首页默认状态，未悬停
- 对比方式：先检查完整首屏，再重点检查右侧“快速选择”三行推荐区域；两者视口不同，因此只比较该组件的排版行为，不比较整体缩放比例。

## Findings

- 已修复 P1：长价格文案曾把左侧说明列挤到单字宽，导致“全能稳定 / 专线与 4K 解锁”竖排。
- 修复后左侧说明列宽为 117 px，三个标题与说明均保持正常横排；右侧价格列宽为 159 px，星岛梦价格在右侧自然换为两行。
- 三条推荐项的 `scrollWidth` 均未超过 `clientWidth`，没有横向溢出。
- 字体、颜色、圆角、分隔线和原有文案保持不变；未引入新图片或替代素材。
- 控制台错误与警告：0。

## Comparison history

1. 初始证据：第二条推荐的右侧 `auto` 列被长文案撑开，左侧列缩至单字宽。
2. 修复：把组件网格改为固定圆点列 + 有最小宽度的说明列 + 可收缩的价格列；为价格增加右对齐和安全换行。
3. 修复后证据：三条内容均无溢出，第二条仅在价格列内换行，左侧不再竖排。

## Implementation checklist

- [x] 左侧标题和说明保持横排
- [x] 长价格仅在右侧列内换行
- [x] 三条推荐项宽度一致且无横向溢出
- [x] 原有交互、配色和文案不变
- [x] 控制台无错误或警告

final result: passed
