import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionTag, Fade, EASE_OUT } from "../components/chrome";

type Tab = {
  id: string;
  label: string;
  title: string;
  body: string;
  blobs: { color: string; size: string; x: string; y: string }[];
  facts: [string, string][];
};

const TABS: Tab[] = [
  {
    id: "concept",
    label: "Concept",
    title: "An opera for ocean data",
    body: "ABYSSAL turns live deep-sea sensor readings — temperature, pressure, bioluminescence — into a cinematic scroll narrative. The brief: make climate data feel like a descent, not a dashboard. Every 100 pixels scrolled equals 100 meters of depth.",
    blobs: [
      { color: "rgba(255,77,0,0.5)", size: "44vmin", x: "12%", y: "8%" },
      { color: "rgba(40,60,120,0.55)", size: "52vmin", x: "55%", y: "42%" },
      { color: "rgba(236,232,223,0.14)", size: "30vmin", x: "64%", y: "6%" },
    ],
    facts: [
      ["Client", "Pelagic Institute (fictional)"],
      ["Year", "2025 — 7 weeks, concept to launch"],
      ["Outcome", "4.2 min avg. session · 31% return rate"],
    ],
  },
  {
    id: "visual",
    label: "Visual",
    title: "Light that behaves like water",
    body: "A custom GLSL depth-falloff shader crushes the palette as you descend — warm signal orange at the surface, abyssal blue-black at 4,000 meters. Typography scales inversely with depth: the deeper you go, the quieter the words get.",
    blobs: [
      { color: "rgba(20,40,110,0.7)", size: "56vmin", x: "30%", y: "30%" },
      { color: "rgba(255,77,0,0.35)", size: "30vmin", x: "66%", y: "10%" },
      { color: "rgba(0,0,0,0.6)", size: "40vmin", x: "8%", y: "55%" },
    ],
    facts: [
      ["Palette", "12 stops, procedurally interpolated"],
      ["Type", "Space Grotesk, 11rem → 1rem by depth"],
      ["Grain", "Animated 35mm-style overlay"],
    ],
  },
  {
    id: "interaction",
    label: "Interaction",
    title: "The scroll is a submersible",
    body: "Depth, velocity and dwell time drive everything: sonar pings fire on scroll velocity, specimens drift toward the cursor, and pausing for three seconds summons a bioluminescent bloom. Nothing on screen is decorative — every pixel is data-bound.",
    blobs: [
      { color: "rgba(255,77,0,0.45)", size: "36vmin", x: "48%", y: "30%" },
      { color: "rgba(120,200,160,0.3)", size: "44vmin", x: "10%", y: "48%" },
      { color: "rgba(236,232,223,0.1)", size: "26vmin", x: "70%", y: "58%" },
    ],
    facts: [
      ["Input", "Scroll velocity · pointer · dwell"],
      ["Cursor", "Becomes a sonar ring below 1,000m"],
      ["Mobile", "Tilt-to-steer via device orientation"],
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    title: "60fps or it didn't happen",
    body: "One draw call for the water column, instanced meshes for 4,000 specimens, and scroll work isolated to compositor-only properties. Ships at 98 Lighthouse performance on a mid-range phone — because spectacle that stutters is just a loading screen with ambition.",
    blobs: [
      { color: "rgba(60,60,66,0.8)", size: "48vmin", x: "22%", y: "18%" },
      { color: "rgba(255,77,0,0.4)", size: "34vmin", x: "60%", y: "46%" },
      { color: "rgba(40,60,120,0.5)", size: "30vmin", x: "42%", y: "60%" },
    ],
    facts: [
      ["Draw calls", "1 water · 1 specimens · 1 type layer"],
      ["Bundle", "184kb gzipped, route-split"],
      ["Score", "98 performance · 100 accessibility"],
    ],
  },
];

export default function CaseStudy() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tab = TABS[active];

  return (
    <section className="section case" id="work" aria-label="Case study">
      <SectionTag index="05" label="Selected fiction" />
      <Fade>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textTransform: "uppercase",
            marginBottom: "0.8rem",
            maxWidth: "16ch",
          }}
        >
          One project, <span style={{ color: "var(--accent)" }}>dissected.</span>
        </h2>
        <p style={{ color: "var(--ink-dim)", fontWeight: 300, maxWidth: "60ch", marginBottom: "2.2rem" }}>
          A fictional commission, executed to real shipping standards — so you can
          inspect how we think, not just what we make.
        </p>
      </Fade>

      <Fade delay={0.1}>
        <div className="case-frame">
          <div className="case-visual" data-cursor="view">
            <AnimatePresence>
              {tab.blobs.map((b, i) => (
                <motion.div
                  key={`${tab.id}-${i}`}
                  className="blob"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: reduce ? 0 : 1.1, ease: EASE_OUT }}
                  style={{
                    background: b.color,
                    width: b.size,
                    height: b.size,
                    left: b.x,
                    top: b.y,
                  }}
                />
              ))}
            </AnimatePresence>
            <div className="case-visual-content">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--ink-dim)",
                  marginBottom: "1rem",
                }}
              >
                Fictional commission — N°07
              </span>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={tab.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -26 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT }}
                >
                  Abyssal
                </motion.h3>
              </AnimatePresence>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginTop: "1rem",
                }}
              >
                {tab.label} — 0{active + 1} / 04
              </span>
            </div>
          </div>

          <div className="case-tabs" role="tablist" aria-label="Case study chapters">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === active}
                className={`case-tab${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
              >
                0{i + 1} · {t.label}
              </button>
            ))}
          </div>

          <div className="case-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -12 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
              >
                <h4>{tab.title}</h4>
                <p>{tab.body}</p>
              </motion.div>
            </AnimatePresence>
            <ul className="case-facts">
              {tab.facts.map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fade>
    </section>
  );
}
