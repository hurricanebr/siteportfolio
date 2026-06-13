import { GlassCard } from "@/components/ui/GlassCard";
import { iconMap } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { circuit } from "@/content/site";

export function CircuitSection() {
  return (
    <section
      id="atuacao"
      className="relative flex min-h-screen items-center py-28"
      aria-label="Áreas de atuação"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/5 bg-ink/45 p-8 backdrop-blur-md sm:p-12">
          <SectionHeading eyebrow={circuit.eyebrow} title={circuit.title} />

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {circuit.areas.map((area, i) => {
              const Icon = iconMap[area.icon];
              return (
                <Reveal key={area.label} delay={0.05 + i * 0.04}>
                  <li className="h-full">
                    <GlassCard
                      interactive
                      padding="p-4"
                      className="flex h-full flex-col items-start gap-3"
                    >
                      {Icon ? (
                        <Icon className="h-5 w-5 text-volt" aria-hidden="true" />
                      ) : null}
                      <span className="text-sm font-medium leading-snug text-silver">
                        {area.label}
                      </span>
                    </GlassCard>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
