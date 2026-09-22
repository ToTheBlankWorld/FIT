import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as FbMouseEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ================= custom cursor ================= */

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const [mode, setMode] = useState<"idle" | "active" | "view">("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    setEnabled(true);
    document.body.classList.add("cursor-on");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const view = t?.closest?.('[data-cursor="view"]');
      const inter = t?.closest?.("a, button, input, [role='button'], [data-cursor]");
      if (view) setMode("view");
      else if (inter) setMode("active");
      else setMode("idle");
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.body.classList.remove("cursor-on");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="cursor-dot"
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className={`cursor-ring${mode === "active" ? " is-active" : ""}${mode === "view" ? " is-view" : ""}`}
        aria-hidden
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
      >
        <span className="cursor-label">View</span>
      </motion.div>
    </>
  );
}

export function Grain() {
  return <div className="grain" aria-hidden />;
}

/* ================= loader ================= */

export function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(() => done.current(), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading"
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } }}
    >
      <div className="loader-inner">
        <div className="loader-count">{count}</div>
        <div className="loader-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <div className="loader-meta">
          <span>Nocturne® Studio</span>
          <span>Initializing experience</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= nav ================= */

const LINKS = [
  { label: "Manifesto", href: "#manifesto", index: "01" },
  { label: "Laboratory", href: "#lab", index: "02" },
  { label: "Capabilities", href: "#capabilities", index: "03" },
  { label: "Stack", href: "#stack", index: "04" },
  { label: "Work", href: "#work", index: "05" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <div className="progress" aria-hidden>
        <motion.div style={{ scaleX: progress }} />
      </div>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="#top" className="brand" aria-label="Nocturne home">
          <span className="brand-mark" aria-hidden />
          NOCTURNE<sup style={{ fontSize: "0.6em", fontWeight: 400 }}>®</sup>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn-sm btn-solid"
            style={{ color: "#0a0a0a" }}
            data-cursor="active"
          >
            Start a project <ArrowUpRight size={13} className="arr" aria-hidden />
          </a>
        </nav>
        <button
          className={`menu-btn${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE_OUT }}
              >
                <small>{l.index}</small> {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
              style={{ color: "var(--accent)" }}
            >
              <small>06</small> Start a project
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= magnetic ================= */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: FbMouseEvent) => {
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* ================= split text reveal ================= */

export function SplitWords({
  text,
  delay = 0,
  stagger = 0.045,
  className,
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MTag = motion[Tag] as typeof motion.span;

  return (
    <MTag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="reveal-mask" aria-hidden>
          <motion.span
            className="reveal-inner"
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MTag>
  );
}

/* ================= section tag + fade ================= */

export function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <motion.span
      className="section-tag"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <b>{index}</b> — {label}
    </motion.span>
  );
}

export function Fade({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const row = reduce ? items : [...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
