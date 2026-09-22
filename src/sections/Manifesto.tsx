import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { SectionTag, EASE_OUT } from "../components/chrome";

const TEXT =
  "Design is not decoration. It is gravity — an invisible force that pulls people in, holds their attention, and refuses to let go. We choreograph type, motion and light until the screen breathes. Static is dead. The web should feel alive.";

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const color = useTransform(progress, range, ["rgba(236,232,223,0.35)", "#ece8df"]);
  const accent = word === "gravity" || word === "alive.";
  return (
    <motion.span
      className="w"
      style={{ opacity, color: accent ? undefined : color }}
      aria-hidden
    >
      <span style={accent ? { color: "var(--accent)" } : undefined}>{word}</span>{" "}
    </motion.span>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className="stat-num">
      {String(val).padStart(2, "0")}
      <em>{suffix}</em>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = TEXT.split(" ");

  return (
    <section className="section" id="manifesto" aria-label="Manifesto">
      <SectionTag index="01" label="Manifesto" />
      <div ref={ref}>
        <p className="manifesto-big" aria-label={TEXT}>
          {words.map((w, i) => (
            <Word
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
            />
          ))}
        </p>
      </div>

      <motion.div
        className="manifesto-side"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <p>
          Most websites are documents with delusions of grandeur. Ours are
          instruments — tuned for tension and release, built at sixty frames per
          second, and measured by how long a visitor forgets to blink.
        </p>
      </motion.div>

      <div className="stat-row">
        <div className="stat">
          <Counter to={47} />
          <div className="stat-label">Interactive experiments shipped</div>
        </div>
        <div className="stat">
          <Counter to={12} />
          <div className="stat-label">International design awards</div>
        </div>
        <div className="stat">
          <Counter to={60} suffix="fps" />
          <div className="stat-label">Or it doesn't ship — performance rule #1</div>
        </div>
      </div>
    </section>
  );
}
