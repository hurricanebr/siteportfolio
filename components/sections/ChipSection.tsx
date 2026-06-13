import { iconMap } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aiSection } from "@/content/site";

export function ChipSection() {
  return (
    <section
      id="ia"
      className="relative flex min-h-screen items-center py-28"
      aria-label="Inteligência Artificial aplicada"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="ml-auto max-w-2xl rounded-3xl border border-white/5 bg-ink/45 p-8 backdrop-blur-md sm:p-12">
          <SectionHeading
            eyebrow={aiSection.eyebrow}
            title={aiSection.title}
            subtitle={aiSection.subtitle}
          />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {aiSection.examples.map((example, i) => {
              const Icon = iconMap[example.icon];
              return (
                <Reveal key={example.label} delay={0.08 + i * 0.05}>
                  <li className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-volt/30">
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                    ) : null}
                    <span className="text-sm leading-relaxed text-silver">
                      {example.label}
                    </span>
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
