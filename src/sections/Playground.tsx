import { useEffect, useRef, useState, useCallback } from "react";
import { SectionTag, Fade } from "../components/chrome";

type Mode = "attract" | "repel" | "vortex" | "flow";

const MODES: { id: Mode; label: string }[] = [
  { id: "attract", label: "Attract" },
  { id: "repel", label: "Repel" },
  { id: "vortex", label: "Vortex" },
  { id: "flow", label: "Flow field" },
];

type P = { x: number; y: number; vx: number; vy: number; s: number; accent: boolean };

export default function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("attract");
  const [force, setForce] = useState(55);
  const [speed, setSpeed] = useState(60);
  const [trails, setTrails] = useState(true);
  const [links, setLinks] = useState(true);
  const [fps, setFps] = useState(60);
  const [count, setCount] = useState(0);

  const params = useRef({ mode, force, speed, trails, links });
  params.current = { mode, force, speed, trails, links };
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const shock = useRef({ x: 0, y: 0, t: 0 });

  const seed = useCallback((w: number, h: number, n: number): P[] => {
    const arr: P[] = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        s: 0.8 + Math.random() * 1.8,
        accent: Math.random() < 0.12,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const N = coarse ? 130 : 260;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let w = 0;
    let h = 0;
    let parts: P[] = [];
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = seed(w, h, N);
      setCount(N);
      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        active: true,
      };
    };
    const onLeave = () => {
      pointer.current.active = false;
      pointer.current.x = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      shock.current = { x: e.clientX - r.left, y: e.clientY - r.top, t: 1 };
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    let raf = 0;
    let frames = 0;
    let lastFpsT = performance.now();
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { mode: m, force: f, speed: sp, trails: tr, links: li } = params.current;
      const F = (f / 55) * 2600;
      const cx = w / 2;
      const cy = h / 2;
      const px = pointer.current.active ? pointer.current.x : cx;
      const py = pointer.current.active ? pointer.current.y : cy;

      if (tr) {
        ctx.fillStyle = "rgba(6, 6, 8, 0.22)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#060608";
        ctx.fillRect(0, 0, w, h);
      }

      // shockwave ring
      if (shock.current.t > 0) {
        shock.current.t -= dt * 1.6;
        const r = (1 - shock.current.t) * 260;
        ctx.strokeStyle = `rgba(255, 77, 0, ${Math.max(0, shock.current.t) * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(shock.current.x, shock.current.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      const spd = 0.4 + (sp / 60) * 1.8;
      for (const p of parts) {
        const dx = px - p.x;
        const dy = py - p.y;
        const dist = Math.hypot(dx, dy) + 0.001;

        if (m === "attract") {
          const a = Math.min(F / (dist * dist + 400), 900) ;
          p.vx += (dx / dist) * a * dt;
          p.vy += (dy / dist) * a * dt;
        } else if (m === "repel") {
          const a = Math.min(F / (dist + 60), 700);
          p.vx -= (dx / dist) * a * dt;
          p.vy -= (dy / dist) * a * dt;
          p.vx += (cx - p.x) * 0.12 * dt;
          p.vy += (cy - p.y) * 0.12 * dt;
        } else if (m === "vortex") {
          const a = Math.min(F / (dist + 120), 520);
          p.vx += (-dy / dist) * a * dt + (dx / dist) * a * 0.18 * dt;
          p.vy += (dx / dist) * a * dt + (dy / dist) * a * 0.18 * dt;
        } else {
          const t = now * 0.00035;
          const ang =
            Math.sin(p.x * 0.008 + t * 2) * 2.2 + Math.cos(p.y * 0.009 - t * 1.6) * 2.2;
          p.vx += Math.cos(ang) * F * 0.35 * dt;
          p.vy += Math.sin(ang) * F * 0.35 * dt;
          if (pointer.current.active && dist < 190) {
            p.vx += (dx / dist) * F * 0.5 * dt;
            p.vy += (dy / dist) * F * 0.5 * dt;
          }
        }

        // shockwave impulse
        if (shock.current.t > 0) {
          const sx = p.x - shock.current.x;
          const sy = p.y - shock.current.y;
          const sd = Math.hypot(sx, sy) + 0.001;
          if (sd < 280) {
            const imp = (1 - sd / 280) * 420 * shock.current.t * dt * 60 * 0.016;
            p.vx += (sx / sd) * imp * 8;
            p.vy += (sy / sd) * imp * 8;
          }
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx * dt * 60 * 0.016 * spd * 3.2;
        p.y += p.vy * dt * 60 * 0.016 * spd * 3.2;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const nearPointer = pointer.current.active && dist < 220;
        ctx.fillStyle = p.accent || nearPointer
          ? "rgba(255, 90, 20, 0.9)"
          : "rgba(236, 232, 223, 0.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      if (li) {
        ctx.lineWidth = 1;
        for (let i = 0; i < parts.length; i += 2) {
          const a = parts[i];
          for (let j = i + 2; j < Math.min(i + 14, parts.length); j += 2) {
            const b = parts[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 5200) {
              ctx.strokeStyle = `rgba(236, 232, 223, ${0.14 * (1 - d2 / 5200)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      frames++;
      if (now - lastFpsT > 500) {
        setFps(Math.round((frames * 1000) / (now - lastFpsT)));
        frames = 0;
        lastFpsT = now;
      }
      raf = requestAnimationFrame(step);
    };

    if (reduced) {
      // one polished static frame
      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, w, h);
      for (const p of parts) {
        ctx.fillStyle = p.accent ? "rgba(255,90,20,0.9)" : "rgba(236,232,223,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, [seed]);

  return (
    <section className="section lab" id="lab" aria-label="Interactive laboratory">
      <SectionTag index="02" label="The laboratory" />
      <Fade>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textTransform: "uppercase",
            maxWidth: "14ch",
          }}
        >
          Don't scroll past. <span style={{ color: "var(--accent)" }}>Touch it.</span>
        </h2>
      </Fade>
      <Fade delay={0.1}>
        <p style={{ color: "var(--ink-dim)", fontWeight: 300, maxWidth: "58ch", margin: "1.2rem 0 2.2rem" }}>
          A live force-field simulation running on a single canvas — no libraries, no video.
          Move your pointer to bend the field, tap to detonate a shockwave, and retune
          the physics below. This is the kind of thing we ship on client work.
        </p>
      </Fade>

      <Fade delay={0.15}>
        <div className="lab-stage" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Interactive particle force-field. Move your pointer over it to disturb the particles."
          />
          <div className="lab-hud">
            <span className="live">Live simulation</span>
            <span>
              {count} particles · {fps} fps
            </span>
          </div>
        </div>
      </Fade>

      <Fade delay={0.2}>
        <div className="lab-controls" role="group" aria-label="Simulation controls">
          <div className="lab-cell">
            <label id="mode-label">Force mode</label>
            <div className="lab-modes" role="group" aria-labelledby="mode-label">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  className={`mode-btn${mode === m.id ? " active" : ""}`}
                  onClick={() => setMode(m.id)}
                  aria-pressed={mode === m.id}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lab-cell">
            <label htmlFor="force">
              Field strength <output>{force}</output>
            </label>
            <input
              id="force"
              type="range"
              min={5}
              max={100}
              value={force}
              onChange={(e) => setForce(Number(e.target.value))}
            />
          </div>
          <div className="lab-cell">
            <label htmlFor="speed">
              Particle velocity <output>{speed}</output>
            </label>
            <input
              id="speed"
              type="range"
              min={10}
              max={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          <div className="lab-cell">
            <label id="render-label">Rendering</label>
            <div className="toggle-row" role="group" aria-labelledby="render-label">
              <button
                className={`mode-btn${trails ? " active" : ""}`}
                onClick={() => setTrails((v) => !v)}
                aria-pressed={trails}
              >
                Trails
              </button>
              <button
                className={`mode-btn${links ? " active" : ""}`}
                onClick={() => setLinks((v) => !v)}
                aria-pressed={links}
              >
                Links
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </section>
  );
}
