import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Cursor, Grain, Loader, Nav } from "./components/chrome";
import Hero from "./sections/Hero";
import Manifesto from "./sections/Manifesto";
import Playground from "./sections/Playground";
import Capabilities from "./sections/Capabilities";
import Stack from "./sections/Stack";
import CaseStudy from "./sections/CaseStudy";
import Finale from "./sections/Finale";

export default function App() {
  const [loading, setLoading] = useState(true);

  // Lenis smooth scroll — disabled for reduced-motion users and while loading
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // anchor links glide through lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -20 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  // lock scroll during the cinematic loader
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <a href="#manifesto" className="skip-link">
        Skip to content
      </a>
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>
      <Cursor />
      <Grain />
      <div className="vignette" aria-hidden />
      <Nav />
      <main>
        <Hero started={!loading} />
        <Manifesto />
        <Playground />
        <Capabilities />
        <Stack />
        <CaseStudy />
        <Finale />
      </main>
    </>
  );
}
