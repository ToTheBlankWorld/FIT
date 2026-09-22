import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionTag, Fade, EASE_OUT } from "../components/chrome";

type Cap = {
  name: string;
  blurb: string;
  detail: string;
  tags: string[];
};

const CAPS: Cap[] = [
  {
    name: "Creative Development",
    blurb: "Award-calibre builds where engineering is the design material.",
    detail:
      "React and TypeScript architectures tuned for sixty frames per second — code-split, GPU-resident, and measured against Core Web Vitals before they ever reach a jury or a customer.",
    tags: ["React", "TypeScript", "Vite", "Edge rendering"],
  },
  {
    name: "Motion Design",
    blurb: "A coherent motion language, not a pile of fade-ins.",
    detail:
      "Spring physics, scroll-choreographed scenes, kinetic typography and micro-interactions with intent — every curve chosen from a system, every duration budgeted like a film cut.",
    tags: ["Springs", "Scroll choreography", "Kinetic type", "Micro-interactions"],
  },
  {
    name: "3D / WebGL",
    blurb: "Real-time scenes that react to people, not just cameras.",
    detail:
      "Custom shaders, reactive geometry and instanced particle systems built on Three.js — pointer-aware, scroll-aware, and performance-guarded with graceful fallbacks when the GPU taps out.",
    tags: ["Three.js", "R3F", "GLSL shaders", "Instancing"],
  },
  {
    name: "Interaction",
    blurb: "Interfaces that listen before they speak.",
    detail:
      "Magnetic controls, contextual cursors, drag and gesture vocabularies, physics playgrounds — interaction models prototyped in days and hardened for touch, keyboard and reduced-motion users alike.",
    tags: ["Gestures", "Magnetic UI", "Playgrounds", "Haptics thinking"],
  },
  {
    name: "Generative Art",
    blurb: "Systems that design back.",
    detail:
      "Force fields, flow noise, rule-based typography and seeded randomness — living visuals that never repeat, delivered as performant canvas and shader work rather than heavy video.",
    tags: ["Canvas", "Noise fields", "Seeded systems", "Live data"],
  },
  {
    name: "Experimental UI",
    blurb: "Navigation nobody has used before — that everyone understands.",
    detail:
      "Orbital menus, scroll-driven narratives, spatial storytelling and theatrical page transitions. Novelty is cheap; we pair it with usability testing so the experiment still converts.",
    tags: ["Spatial UI", "Narratives", "Transitions", "Prototyping"],
  },
];

function Row({
  cap,
  index,
  open,
  onToggle,
}: {
  cap: Cap;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`cap-row${open ? " open" : ""}`}>
      <button
        className="cap-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`cap-panel-${index}`}
      >
        <span className="cap-index">0{index + 1}</span>
        <span className="cap-name">{cap.name}</span>
        <span className="cap-count">{String(cap.tags.length * 7).padStart(2, "0")} techniques</span>
        <span className="cap-plus" aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`cap-panel-${index}`}
            className="cap-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: EASE_OUT }}
          >
            <div className="cap-body-inner">
              <div>
                <p style={{ fontSize: "1.15rem", color: "var(--ink)" }}>{cap.blurb}</p>
                <p style={{ marginTop: "0.9rem" }}>{cap.detail}</p>
              </div>
              <ul className="cap-tags" aria-label={`${cap.name} techniques`}>
                {cap.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Capabilities() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="capabilities" aria-label="Capabilities">
      <SectionTag index="03" label="Capabilities" />
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
          Six disciplines, <span style={{ color: "var(--accent)" }}>one obsession.</span>
        </h2>
      </Fade>
      <Fade delay={0.1}>
        <div className="cap-list">
          {CAPS.map((c, i) => (
            <Row
              key={c.name}
              cap={c}
              index={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </Fade>
    </section>
  );
}
