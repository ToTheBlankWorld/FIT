import { Suspense, lazy, Component, type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { SplitWords, Magnetic, EASE_OUT } from "../components/chrome";

const HeroScene = lazy(() => import("../components/HeroScene"));

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <div className="hero-fallback" aria-hidden />;
    return this.props.children;
  }
}

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const canvasY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  return (
    <section className="hero" id="top" ref={ref} aria-label="Introduction">
      <motion.div className="hero-canvas" style={{ y: canvasY }} aria-hidden>
        <SceneErrorBoundary>
          <Suspense fallback={<div className="hero-fallback" />}>
            <HeroScene />
          </Suspense>
        </SceneErrorBoundary>
      </motion.div>
      <div className="hero-shade" aria-hidden />

      <motion.div className="hero-content" style={{ y: titleY, opacity: fade }} key={String(started)}>
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 14 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
        >
          <span className="dot" aria-hidden />
          Independent creative technology studio — Est. 2017
        </motion.p>
        <h1 className="hero-title">
          <SplitWords text="WE BUILD" delay={started ? 0.2 : 99} stagger={0.06} as="span" />
          <br />
          <span className="outline">
            <SplitWords text="DIGITAL" delay={started ? 0.35 : 99} stagger={0.06} as="span" />
          </span>
          <br />
          <SplitWords text="GRAVITY." delay={started ? 0.5 : 99} stagger={0.06} as="span" />
        </h1>

        <motion.div
          className="hero-sub"
          initial={{ opacity: 0, y: 24 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.9 }}
        >
          <p>
            Nocturne is a studio operating after dark — fusing cinematic motion,
            real-time 3D and interaction design into websites that pull people in
            and refuse to let go.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Magnetic>
              <a href="#work" className="btn btn-solid" data-cursor="active">
                See the proof <ArrowUpRight size={14} className="arr" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#lab" className="btn" data-cursor="active">
                Enter the lab <ArrowDown size={14} className="arr" aria-hidden />
              </a>
            </Magnetic>
          </div>
        </motion.div>

        <motion.div
          className="hero-meta"
          style={{ marginTop: "1.6rem" }}
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span>Based<b>Everywhere / Remote</b></span>
          <span>Recognition<b>12 intl. awards</b></span>
          <span>Discipline<b>Motion · 3D · Interaction</b></span>
        </motion.div>
      </motion.div>

      <div className="scroll-hint" aria-hidden>
        Scroll
      </div>
    </section>
  );
}
