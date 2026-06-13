"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";
import { journeyState, measureJourney } from "@/lib/journey";

/**
 * Providers globais:
 * - Lenis: smooth scroll (desativado para quem prefere movimento reduzido)
 * - MotionConfig: faz o framer-motion respeitar prefers-reduced-motion
 * - Listeners globais de ponteiro/resize usados pela cena 3D
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    measureJourney();

    const onPointerMove = (e: PointerEvent) => {
      journeyState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      journeyState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => measureJourney();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    // O conteúdo pode mudar de altura depois do primeiro paint
    // (fontes, imagens) — re-mede a jornada quando isso acontecer.
    const observer = new ResizeObserver(() => measureJourney());
    observer.observe(document.body);

    if (reduced) {
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        observer.disconnect();
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      // Offset para os links de âncora não ficarem sob a navbar fixa
      anchors: { offset: -96 },
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
