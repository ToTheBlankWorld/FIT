# FIT

> **FIT Studio — Demo Site**  
> A cinematic, single-page demo experience built with React, Three.js, and Framer Motion.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Overview

FIT Studio Demo is a production-grade showcase of modern web craftsmanship: a dark, cinematic landing experience featuring a custom GLSL hero scene, scroll-driven storytelling, a live particle laboratory, and buttery-smooth motion throughout.

Designed as a benchmark piece — every interaction is intentional, every frame is budgeted, and the whole thing ships at **60fps** or it doesn't ship.

---

## 🎬 Features

- 🎬 **Cinematic loader** — percentage counter, progress bar, and orchestrated page reveal
- 🧊 **Real-time 3D hero** — custom vertex/fragment shaders, pointer-reactive displacement, particle shell
- 📜 **Scroll choreography** — Lenis smooth scrolling + Framer Motion scroll-linked transforms
- 🧪 **Interactive laboratory** — raw Canvas 2D force-field simulation (attract / repel / vortex / flow) with live FPS HUD
- 🧲 **Magnetic UI & custom cursor** — spring-damped pointer interactions with contextual states
- 🌀 **Orbital tech stack** — interactive constellation diagram with animated detail panel
- 📑 **Accordion capabilities** — accessible, animated disclosure rows
- 🗂️ **Tabbed case study** — multi-chapter project breakdown with animated visuals
- 📱 **Fully responsive** — desktop, tablet, and mobile layouts with a mobile menu
- ♿ **Accessibility-first** — skip link, focus-visible styles, ARIA labels, `prefers-reduced-motion` support
- 🎞️ **Grain + vignette atmosphere** — film-grade texture overlay for depth

---

## 🛠️ Tech Stack

| Layer | Tools |
| --- | --- |
| **Framework** | React 19 · TypeScript |
| **Build** | Vite 8 · Oxlint |
| **3D** | Three.js · React Three Fiber · GLSL shaders |
| **Motion** | Framer Motion · Lenis smooth scroll |
| **Icons** | Lucide React |
| **Styling** | Hand-tuned CSS (custom properties, GPU-only transforms) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (recommended)
- **npm** 10+

### Installation

```bash
git clone git@github.com:ToTheBlankWorld/FIT.git
cd FIT
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
FIT/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── chrome.tsx        # Cursor, loader, nav, utilities
│   │   └── HeroScene.tsx     # Three.js shader hero
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Manifesto.tsx
│   │   ├── Playground.tsx    # Canvas particle lab
│   │   ├── Capabilities.tsx
│   │   ├── Stack.tsx
│   │   ├── CaseStudy.tsx
│   │   └── Finale.tsx
│   ├── App.tsx
│   ├── index.css             # Design system
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🎨 Design System

| Token | Value |
| --- | --- |
| Background | `#08080a` |
| Ink | `#ece8df` |
| Accent | `#ff4d00` |
| Display | Space Grotesk |
| Body | Inter |
| Mono | JetBrains Mono |
| Easing | `cubic-bezier(0.23, 1, 0.32, 1)` |

---

## ♿ Accessibility

- Skip-to-content link
- Visible focus rings for keyboard navigation
- Full `prefers-reduced-motion` fallbacks (scroll, 3D, particles, reveals)
- Semantic landmarks and ARIA labels throughout
- Touch-safe custom cursor (disabled on coarse pointers)

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

---

## 📄 License

MIT © FIT Studio

---

<p align="center">
  <strong>Built after dark · Engineered at 60fps · No templates were harmed</strong>
</p>
