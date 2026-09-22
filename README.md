<div align="center">

# FIT

### *FIT Studio — Demo Site*

**A cinematic single-page experience engineered at 60fps.**
Real-time 3D · Scroll choreography · Living particles · Zero templates harmed.

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-049EF4?logo=threedotjs&logoColor=white)
![Framer](https://img.shields.io/badge/Motion-Framer-ff0055?logo=framer&logoColor=white)
![Oxlint](https://img.shields.io/badge/linter-Oxlint-7EE787?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjM2ViZmU5Ij48cGF0aCBkPSJNMTIgMi41Yy01LjI0IDAtOS41IDQuMjYtOS41IDkuNXM0LjI2IDkuNSA5LjUgOS41IDkuNS00LjI2IDkuNS05LjUtNC4yNi05LjUtOS41LTkuNXptMCAxNy41Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-ff4d00?style=flat)
![Stars](https://img.shields.io/github/stars/ToTheBlankWorld/FIT?style=flat&logo=github&color=ff4d00)

<br/>

<a href="#-tldr"><strong>⚡ TL;DR</strong></a>
  ·
<a href="#-features"><strong>✨ Features</strong></a>
  ·
<a href="#-quick-start"><strong>🚀 Quick Start</strong></a>
  ·
<a href="#-design-system"><strong>🎨 Design</strong></a>
  ·
<a href="#-architecture"><strong>🏗️ Architecture</strong></a>
  ·
<a href="#-license"><strong>📄 License</strong></a>

<br/>
<br/>

<img src="https://img.shields.io/badge/%F0%9F%8E%AC-LIVE%20DEMO-ff4d00?style=for-the-badge" alt="Live Demo"/> <a href="https://github.com/ToTheBlankWorld/FIT"><img src="https://img.shields.io/badge/%F0%9F%92%BB-VIEW%20SOURCE-0d0d10?style=for-the-badge" alt="Source"/></a>

</div>

---

## ⚡ TL;DR

```bash
git clone https://github.com/ToTheBlankWorld/FIT.git
cd FIT && npm install && npm run dev
# → http://localhost:5173
```

> Dark. Cinematic. Interactive. Built to prove the web can still surprise you.

---

## 🎯 What is this?

**FIT Studio** is a fictional creative-technology studio demo — a full landing experience that feels less like a website and more like a **short film you can steer**.

Every section is a set piece:

| # | Scene | What happens |
|:-:|-------|--------------|
| 🎬 | **Loader** | Percentage counter, progress bar, curtain-raise exit |
| 🌌 | **Hero** | Custom GLSL icosahedron that *reacts to your cursor & scroll* |
| 📜 | **Manifesto** | Scroll-scrubbed word-by-word text reveal + live counters |
| 🧪 | **Laboratory** | Raw Canvas force-field — attract / repel / vortex / flow |
| 🧲 | **Capabilities** | Animated accordion of six disciplines |
| 🌀 | **Stack** | Orbital constellation of the tech, click to explore |
| 🗂️ | **Case Study** | Tabbed breakdown of a fictional deep-sea project |
| 💀 | **Finale** | Marquee, magnetic CTA, footer — curtain out |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎬 Cinematic Systems
- Percentage loader with orchestrated reveal
- Film grain + vignette atmosphere
- Scroll progress bar in accent orange
- Marquee ticker strip

### 🧊 Real-Time 3D
- Hand-written **GLSL** vertex + fragment shaders
- Pointer-reactive surface displacement
- Additive particle shell (1,100 points)
- Scroll-linked camera/group tilt
- GPU fallback via error boundary

### 📜 Motion Language
- **Lenis** inertial smooth scroll
- Scroll-scrubbed manifesto typography
- Spring-damped magnetic buttons
- Clip-path word reveals with stagger
- One easing curve to rule them all

</td>
<td width="50%">

### 🧪 Interactive Laboratory
- Live **Canvas 2D** force-field sim
- 4 modes: Attract · Repel · Vortex · Flow
- Click → shockwave impulse
- Trails & constellation links toggles
- Real-time **FPS + particle HUD**

### 🧭 Interface Chrome
- Custom dual-element cursor (dot + ring)
- Contextual **“View”** cursor state
- Mobile hamburger → full-screen menu
- Sticky glass nav after scroll
- Magnetic hover on CTAs

### ⚙️ Engineering
- React 19 + strict TypeScript
- Lazy-loaded 3D scene
- Code-split production bundle
- `prefers-reduced-motion` everywhere
- Skip link · focus rings · ARIA

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **20+** (LTS recommended) |
| npm | **10+** |

### 1 · Clone & install

```bash
git clone https://github.com/ToTheBlankWorld/FIT.git
cd FIT
npm install
```

### 2 · Develop

```bash
npm run dev
```

Open **http://localhost:5173** and go full screen. 🖤

### 3 · Ship

```bash
npm run lint     # Oxlint
npm run build    # tsc -b && vite build
npm run preview  # serve the production bundle
```

---

## 🗂️ Project Structure

```
FIT/
├── 📄 index.html                 # Shell · fonts · meta
├── ⚙️ vite.config.ts
├── 📦 package.json
│
├── 🌐 public/
│   └── favicon.svg
│
└── 🎨 src/
    ├── main.tsx                  # React root
    ├── App.tsx                   # Lenis · loader · layout
    ├── index.css                 # Entire design system
    │
    ├── 🧩 components/
    │   ├── chrome.tsx            # Cursor · Loader · Nav · Magnetic · SplitWords
    │   └── HeroScene.tsx         # Three.js canvas + GLSL core
    │
    └── 🎬 sections/
        ├── Hero.tsx              # 00 — opening title
        ├── Manifesto.tsx         # 01 — scroll-scrubbed copy
        ├── Playground.tsx        # 02 — particle laboratory
        ├── Capabilities.tsx      # 03 — accordion disciplines
        ├── Stack.tsx             # 04 — orbital tech diagram
        ├── CaseStudy.tsx         # 05 — tabbed fiction
        └── Finale.tsx            # 06 — CTA + footer
```

---

## 🎨 Design System

<div align="center">

| Role | Swatch | Token | Value |
|:----:|:------:|-------|-------|
| 🌑 | `██` | `--bg` | `#08080a` |
| 🖤 | `██` | `--bg-2` | `#0d0d10` |
| 🦴 | `██` | `--ink` | `#ece8df` |
| 🔥 | `██` | `--accent` | `#ff4d00` |

</div>

| Layer | Choice | Why |
|-------|--------|-----|
| **Display** | Space Grotesk | Tight, technical, cinematic |
| **Body** | Inter | Invisible, readable, variable |
| **Mono** | JetBrains Mono | HUD labels, counters, meta |
| **Easing** | `cubic-bezier(0.23, 1, 0.32, 1)` | One strong ease-out everywhere |
| **Spacing** | `clamp()` fluid scale | No breakpoint jumps |
| **Motion** | `transform` / `opacity` only | GPU compositor, never layout |

> **Rule #0:** If it stutters, it doesn’t ship. **60fps or it didn’t happen.**

---

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     App.tsx      │
                    │  Lenis · Loader  │
                    └────────┬─────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌────────────┐   ┌──────────────┐   ┌────────────┐
    │   Chrome   │   │  Sections    │   │  HeroScene │
    │ Cursor     │   │ Hero → …     │   │ R3F Canvas │
    │ Nav        │   │ → Finale     │   │ GLSL Core  │
    │ Loader     │   │ (scroll DOM) │   │ Particles  │
    │ Magnetic   │   └──────────────┘   └────────────┘
    └────────────┘
           │                 │                 │
           └─────────────────┴─────────────────┘
                             ▼
                    ┌──────────────────┐
                    │    index.css     │
                    │  design tokens   │
                    └──────────────────┘
```

**Key patterns**

- 🧱 **Section-per-file** — each scene owns its motion + markup
- 🎭 **Error boundary + lazy 3D** — hero degrades to a gradient if WebGL dies
- 🪝 **Ref-driven uniforms** — pointer/scroll write to refs, shaders read them (zero re-renders)
- 📡 **`useReducedMotion`** — every animation path has a still-frame escape hatch

---

## 📊 Performance Budget

| Metric | Target | How |
|--------|:------:|-----|
| Frame rate | **60 fps** | Compositor-only props · capped DPR · delta clamping |
| Layout thrash | **0** | `transform` / `opacity` exclusively |
| Bundle | Route-split | 3D scene lazy-loaded behind suspense |
| Input latency | Immediate | Pointer writes go to refs, not state |
| Reduced motion | Full parity | Static frames, no autoplay loops |

---

## ♿ Accessibility

- ✅ Skip-to-content link
- ✅ Visible `:focus-visible` rings
- ✅ Semantic landmarks + `aria-label` on every section
- ✅ `aria-expanded` / `aria-pressed` / `role="tab"` on interactive widgets
- ✅ Full **`prefers-reduced-motion`** fallbacks (scroll · 3D · particles · grain · marquee)
- ✅ Custom cursor auto-disables on touch / coarse pointers
- ✅ Canvas lab exposes text alternative via `role="img"`

---

## 📜 Scripts

```bash
npm run dev       # ▶  Vite dev server (HMR)
npm run build     # 🔒 tsc -b && vite build
npm run preview   # 👀 Preview production build
npm run lint      # 🧹 Oxlint
```

---

## 🧩 Built With

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| React | TypeScript | Vite | Three.js |
| R3F | Framer Motion | Lenis | Lucide |
| Oxlint | GLSL | Canvas 2D | CSS Vars |

</div>

---

## 📄 License

MIT © **FIT Studio**

Do whatever you want — build on it, learn from it, ship it.  
A star ⭐ on the repo is always appreciated.

---

<div align="center">

<br/>

**🖤 Built after dark · Engineered at 60fps · No templates were harmed.**

<br/>

<img src="https://img.shields.io/badge/%F0%9F%92%80-WIP%20%2F%20DEMO-0d0d10?style=for-the-badge" alt="Demo"/>

</div>
