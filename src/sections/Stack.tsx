import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionTag, Fade, EASE_OUT } from "../components/chrome";

type Tech = {
  name: string;
  role: string;
  detail: string;
  level: number;
  // orbit config: ring radius %, angle deg, size tier
  ring: number;
  angle: number;
};

const TECHS: Tech[] = [
  { name: "React", role: "Interface runtime", detail: "Component architecture with surgical re-renders. The stage everything performs on.", level: 96, ring: 0, angle: 20 },
  { name: "TypeScript", role: "Safety net", detail: "Strict types across the whole experience — refactors without fear, autocompletion everywhere.", level: 94, ring: 0, angle: 140 },
  { name: "Three.js", role: "3D engine", detail: "Custom shaders, instanced particles and reactive geometry. Real-time scenes, not pre-renders.", level: 90, ring: 0, angle: 260 },
  { name: "Motion", role: "Animation", detail: "Springs, scroll-linked scenes and orchestrated entrances with a single coherent easing language.", level: 92, ring: 1, angle: 70 },
  { name: "GLSL", role: "Shaders", detail: "Hand-written vertex and fragment programs — the hero core on this page is 100% shader math.", level: 84, ring: 1, angle: 190 },
  { name: "Canvas", role: "2D simulation", detail: "The laboratory below is raw Canvas 2D — force fields, shockwaves and link rendering at 60fps.", level: 91, ring: 1, angle: 310 },
  { name: "Lenis", role: "Smooth scroll", detail: "Buttery inertial scrolling wired into every scroll-linked animation on this page.", level: 88, ring: 2, angle: 10 },
  { name: "Vite", role: "Build system", detail: "Instant dev loops and aggressively code-split production bundles.", level: 93, ring: 2, angle: 130 },
  { name: "CSS", role: "Visual system", detail: "Custom properties, clip reveals and GPU-only transforms. No framework bloat — this page's CSS is hand-tuned.", level: 95, ring: 2, angle: 250 },
];

const RINGS = [30, 41, 49]; // % radii

function pos(ring: number, angleDeg: number) {
  const r = RINGS[ring];
  const a = (angleDeg * Math.PI) / 180;
  return { left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` };
}

export default function Stack() {
  const [active, setActive] = useState(2); // Three.js default — ties to the hero
  const reduce = useReducedMotion();
  const tech = TECHS[active];

  return (
    <section className="section" id="stack" aria-label="Technology stack">
      <SectionTag index="04" label="The machinery" />
      <Fade>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textTransform: "uppercase",
            marginBottom: "2.5rem",
            maxWidth: "16ch",
          }}
        >
          A stack tuned for <span style={{ color: "var(--accent)" }}>spectacle.</span>
        </h2>
      </Fade>

      <div className="stack-grid">
        <Fade>
          <div className="orbit-wrap" role="group" aria-label="Technology orbit diagram">
            <svg className="orbit-svg" viewBox="0 0 100 100" aria-hidden>
              {RINGS.map((r, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={r}
                  className={`orbit-ring${i === 0 ? " accent-ring" : ""}`}
                />
              ))}
              <line x1="50" y1="50" x2="50" y2="1" stroke="var(--line)" strokeWidth="0.3" strokeDasharray="1 1" />
            </svg>
            <motion.div
              className="orbit-core"
              animate={reduce ? {} : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              N®
            </motion.div>
            {TECHS.map((t, i) => (
              <button
                key={t.name}
                className={`orbit-node${i === active ? " active" : ""}`}
                style={pos(t.ring, t.angle)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`${t.name} — ${t.role}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </Fade>

        <Fade delay={0.12}>
          <div className="stack-detail" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  {tech.role}
                </span>
                <h3>{tech.name}</h3>
                <p>{tech.detail}</p>
                <div className="stack-meter" aria-hidden>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: tech.level / 100 }}
                    transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT, delay: 0.15 }}
                    style={{ transformOrigin: "left", width: "100%" }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--ink-faint)",
                    letterSpacing: "0.14em",
                  }}
                >
                  STUDIO MASTERY — {tech.level}%
                </span>
                <div className="stack-list">
                  {TECHS.map((t, i) => (
                    <button
                      key={t.name}
                      className={`mode-btn${i === active ? " active" : ""}`}
                      onClick={() => setActive(i)}
                      aria-pressed={i === active}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Fade>
      </div>
    </section>
  );
}
