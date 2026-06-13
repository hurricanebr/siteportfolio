"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { method } from "@/content/site";

export function MethodSection() {
  return (
    <section id="metodo" className="relative py-28" aria-label="Método de trabalho">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow={method.eyebrow}
          title={method.title}
          subtitle={method.subtitle}
        />

        {/* Linha do processo — visual de circuito vertical */}
        <div className="relative mt-16 max-w-3xl">
          <motion.div
            aria-hidden="true"
            className="absolute bottom-5 left-[21px] top-5 w-px origin-top bg-gradient-to-b from-volt/70 via-azure/50 to-gilt/40"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />

          <ol className="flex flex-col gap-6">
            {method.steps.map((step, i) => (
              <Reveal key={step.title} delay={0.06 + i * 0.05}>
                <li className="relative flex items-start gap-5 pl-1">
                  <span
                    className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-volt/40 bg-ink font-display text-sm font-semibold text-volt"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4">
                    <h3 className="font-display text-base font-semibold tracking-tight text-frost">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-steel">
                      {step.description}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
