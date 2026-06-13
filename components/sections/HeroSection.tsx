"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { hero } from "@/content/site";

export function HeroSection() {
  const reduced = useReducedMotion();

  const item = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(10px)" },
    animate: reduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center"
      aria-label="Apresentação"
    >
      {/* Scrim local para garantir contraste sobre a cena 3D */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(4,6,13,0.78) 0%, rgba(4,6,13,0.35) 45%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-36">
        <div className="max-w-3xl">
          <motion.p
            {...item(0.1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-volt/20 bg-volt/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-volt"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...item(0.22)}
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-frost sm:text-6xl lg:text-7xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            {...item(0.36)}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            {...item(0.46)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-steel"
          >
            {hero.support}
          </motion.p>

          <motion.div
            {...item(0.58)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href={hero.ctaPrimary.href} variant="primary">
              {hero.ctaPrimary.label}
            </ButtonLink>
            <ButtonLink href={hero.ctaSecondary.href} variant="ghost">
              {hero.ctaSecondary.label}
            </ButtonLink>
            <a
              href={hero.ctaTertiary.href}
              className="group inline-flex min-h-12 cursor-pointer items-center gap-2 px-2 py-3 text-sm font-medium text-steel transition-colors duration-200 hover:text-volt"
            >
              {hero.ctaTertiary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-steel sm:flex"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.25em]">
          {hero.scrollHint}
        </span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </section>
  );
}
