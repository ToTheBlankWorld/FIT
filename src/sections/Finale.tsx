import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { SplitWords, Magnetic, Marquee } from "../components/chrome";

export default function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1]);
  const glow = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <>
      <Marquee
        items={[
          "Motion is meaning",
          "Static is dead",
          "60fps or nothing",
          "Design is gravity",
          "Built after dark",
        ]}
      />
      <section className="section finale" id="contact" ref={ref} aria-label="Contact">
        <motion.div style={{ scale }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
              marginBottom: "1.6rem",
            }}
          >
            06 — Final transmission
          </p>
          <h2 className="finale-title">
            <SplitWords text="THE WEB" stagger={0.08} as="span" />
            <br />
            <span className="outline">
              <SplitWords text="SHOULD FEEL" stagger={0.08} as="span" />
            </span>
            <br />
            <motion.span style={{ color: "var(--accent)" }}>
              <SplitWords text="ALIVE." stagger={0.08} as="span" />
            </motion.span>
          </h2>
          <motion.p
            style={{
              color: "var(--ink-dim)",
              fontWeight: 300,
              maxWidth: "52ch",
              margin: "2rem auto 2.6rem",
            }}
          >
            You just felt it — scroll physics, living particles, a shader that
            watches your cursor. Imagine what we do with your story. One email
            is all it takes to start.
          </motion.p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Magnetic strength={0.45}>
              <a
                href="mailto:hello@fitstudio.demo"
                className="btn btn-solid"
                style={{ fontSize: "0.85rem", padding: "1.3rem 2.6rem" }}
                data-cursor="active"
              >
                Start a project <ArrowUpRight size={16} className="arr" aria-hidden />
              </a>
            </Magnetic>
          </div>
          <motion.div
            style={{ opacity: glow, marginTop: "3rem" }}
            aria-hidden
          >
            <a
              href="mailto:hello@fitstudio.demo"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.9rem, 2.4vw, 1.3rem)",
                letterSpacing: "0.06em",
                color: "var(--ink-dim)",
              }}
              className="u-link"
              tabIndex={-1}
            >
              hello@fitstudio.demo
            </a>
          </motion.div>
        </motion.div>

        <footer className="footer" aria-label="Footer">
          <div className="footer-top">
            <div>
              <a href="#top" className="brand" aria-label="Back to top">
                <span className="brand-mark" aria-hidden />
                FIT<sup style={{ fontSize: "0.6em", fontWeight: 400 }}>®</sup>
              </a>
              <p
                style={{
                  color: "var(--ink-faint)",
                  fontSize: "0.88rem",
                  fontWeight: 300,
                  marginTop: "1rem",
                  maxWidth: "30ch",
                }}
              >
                An independent creative technology studio. We build digital
                gravity — after dark, at 60fps.
              </p>
            </div>
            <nav aria-label="Sitemap">
              <h5>Index</h5>
              <ul className="footer-links">
                <li><a href="#manifesto" className="u-link">Manifesto</a></li>
                <li><a href="#lab" className="u-link">Laboratory</a></li>
                <li><a href="#capabilities" className="u-link">Capabilities</a></li>
                <li><a href="#stack" className="u-link">Stack</a></li>
                <li><a href="#work" className="u-link">Work</a></li>
              </ul>
            </nav>
            <nav aria-label="Social">
              <h5>Elsewhere</h5>
              <ul className="footer-links">
                <li><a href="#top" className="u-link">X / Twitter</a></li>
                <li><a href="#top" className="u-link">Instagram</a></li>
                <li><a href="#top" className="u-link">Are.na</a></li>
                <li><a href="#top" className="u-link">GitHub</a></li>
              </ul>
            </nav>
            <div>
              <h5>Colophon</h5>
              <ul className="footer-links">
                <li>React · Three.js · Motion</li>
                <li>Space Grotesk · Inter · Mono</li>
                <li>
                  <a href="#top" className="u-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    Back to top <ArrowUp size={12} style={{ display: "inline", verticalAlign: "baseline" }} aria-hidden />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FIT Studio — a fictional benchmark piece</span>
            <span>Designed & engineered in one sitting</span>
            <span>No templates were harmed</span>
          </div>
        </footer>
      </section>
    </>
  );
}
