# Design Spec — zijun.cloud

## Agent Quick Reference

### Colors (NEVER hardcode raw hex — use these exact values)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#faf9f7` | Page background |
| `--foreground` | `#3d2b1f` | Primary text |
| `--accent` | `#b85c38` | Accent / CTA |
| `--accent-hover` | `#a04e2e` | Hover state |

### Standard opacity modifiers (on foreground `#3d2b1f`)
- Body text: `/60`
- Muted text: `/40` or `/45`
- Subtle: `/30`
- Very subtle: `/20`
- Borders: `/5` or `/8`
- Hover borders: `/20`

### Page layout (every section page)
```
<SectionContainer> wraps content with:
  pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-24
  max-w-2xl mx-auto
```

### Page header (every section page)
```
<PageHeader eyebrow="..." title="..." subtitle="..." />
  Eyebrow: text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4
  Title:   font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3
  Subtitle: text-sm md:text-base text-[#3d2b1f]/40 mb-12 md:mb-16
```

### Tags
```
<TagList tags={[...]} size="sm" />  — about page skills
<TagList tags={[...]} size="base" /> — project detail tags
```

---

## 概述

Alex Bao (Zijun Bao) 的个人网站，2026年3月24日 v1 上线。

**参考风格**: Anthropic / Claude 官网 — warm, human, refined, non-industrial.

---

## 色彩

| Token | Hex | 用途 |
|-------|-----|------|
| `--background` | `#faf9f7` | 页面背景，温暖奶油白 |
| `--foreground` | `#3d2b1f` | 主文字，深暖棕色 |
| `--accent` | `#b85c38` | 强调色，暖珊瑚/琥珀 |
| `--accent-hover` | `#a04e2e` | hover 状态 |

---

## 字体

| 用途 | 字体 | 来源 |
|------|------|------|
| 页面标题 (H1) | Cormorant Garamond | next/font/google |
| 正文 / 导航 | Geist | 本地 woff2 (`app/fonts/`) |
| 中文正文 | Noto Serif SC | next/font/google |
| 中文标题 | Noto Serif SC | next/font/google |

### 字号层级

```
Hero Name:     text-6xl md:text-8xl  (serif, medium)
Page H1:       text-3xl md:text-4xl lg:text-5xl  (serif)
Body:          text-sm md:text-base  (14px mobile, 16px desktop)
Label (eyebrow): text-[13px] tracking-[0.3em] uppercase  (accent color)
Nav items:     text-sm  (body color)
```

---

## 布局节奏

```
内容容器:   max-w-2xl mx-auto
左右 padding: px-6 md:px-20   (24px mobile, 80px desktop)
顶部 padding: pt-24 md:pt-32  (96px mobile, 128px desktop)
底部 padding: pb-16 md:pb-20/24
标题间距:   mb-3 (h1 到 p), mb-16 (subtitle 到内容)
```

---

## 组件

### 导航栏 (Navigation.tsx)
- 固定顶部，`z-50`
- 滚动后: `bg-[#faf9f7]/80 backdrop-blur-sm`
- Logo: 左对齐，"Alex Bao"，`text-sm font-medium`
- Nav items: 居中，`absolute left-1/2 -translate-x-1/2`，5个链接，gap-12
- Locale toggle: 右对齐
- 手机端: hamburger icon，展开全屏 overlay

### Hero 页面
- 全屏高度，`flex items-center justify-center`
- 标签行: "Currently Open to Opportunities"，accent color，tracking
- 姓名: serif 超大字体 (6xl md:8xl)
- Role: accent color，轻盈
- 标语: `max-w-4xl mx-auto`，允许换行
- CTA 按钮: 主色填充 + 边框幽灵按钮，gap-4
- 角落装饰: 固定 L 形边框，左上/右下（桌面端）
- 滚动指示器: 渐变竖线

### 项目列表 (Projects)
- Swiss-style: 无边框，无卡片，用 `h-px` 分隔线
- 每个项目: 标题 + year · type + tagline + tags
- 链接: 整行可点击，`hover:bg-[#3d2b1f]/[0.02]`
- 手机: 隐藏 year，只显示 type

### 联系人 (Contact)
- 无边框列表行，`py-5`，`border-b`
- Email: CopyEmailButton 组件，clipboard API
- GitHub: 外部链接
- CV: PDF 下载
- 底部: 同心圆动画 + 标语
- 图标: 圆形按钮，`hover:scale-110`

### 关于页 (About)
- 4段自我介绍
- Skills: `flex flex-wrap gap-2`，pill tags
- 分隔线: `border-t`

### 博客页 (Blog)
- 占位内容，未来填充真实文章

---

## 动效

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered delays */
.animate-fade-in        { animation: fade-in 0.8s ease-out forwards; }
.animate-fade-in-delay-1 { opacity: 0; animation: fade-in 0.8s ease-out 0.15s forwards; }
.animate-fade-in-delay-2 { opacity: 0; animation: fade-in 0.8s ease-out 0.30s forwards; }
.animate-fade-in-delay-3 { opacity: 0; animation: fade-in 0.8s ease-out 0.45s forwards; }
.animate-fade-in-delay-4 { opacity: 0; animation: fade-in 0.8s ease-out 0.60s forwards; }
.animate-fade-in-delay-5 { opacity: 0; animation: fade-in 0.8s ease-out 0.80s forwards; }
```

---

## 手机端

- 导航: hamburger → 全屏 overlay，`bg-[#faf9f7]`，nav items 垂直居中
- 触摸区域: ≥ 44px
- 角落装饰: `hidden md:block`
- 项目: 隐藏 year
- Hero 标语: 自然换行（不加 `whitespace-nowrap`）

---

## i18n

- 默认语言: `en`
- 翻译语言: `zh`
- 翻译文件: `messages/en.json`, `messages/zh.json`
- Nav label: "About" / "关于"
- About page label: "Me" / "我"

---

## 部署

- Vercel: alex-baos-projects/zijun.cloud
- 域名: zijun.cloud (Vercel 注册)
- 自动部署: GitHub push 触发

---

## 待填充内容

1. **博客**: 真实中文文章 (AI学习/成长)
2. **项目详情**: NeoChain WMS / IGC / Cathay Hackathon 详细页面
3. **About**: 更有吸引力的措辞
4. **Guestbook**: 后续迭代
