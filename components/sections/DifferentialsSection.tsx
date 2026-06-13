import { Zap } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentials } from "@/content/site";

export function DifferentialsSection() {
  return (
    <section
      id="diferenciais"
      className="relative py-28"
      aria-label="Diferenciais"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow={differentials.eyebrow}
          title={differentials.title}
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.items.map((item, i) => (
            <Reveal key={item} delay={0.04 + i * 0.04}>
              <li className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5 transition-colors duration-200 hover:border-volt/30">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-silver">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {differentials.statements.map((statement, i) => (
            <Reveal key={statement} delay={0.1 + i * 0.08}>
              <blockquote className="h-full rounded-2xl border border-white/5 border-l-2 border-l-volt/60 bg-ink/60 px-6 py-6 backdrop-blur-md">
                <p className="font-display text-base font-medium leading-relaxed tracking-tight text-frost sm:text-lg">
                  {statement}
                </p>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
