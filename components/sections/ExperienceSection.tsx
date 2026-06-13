import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/content/site";

export function ExperienceSection() {
  return (
    <section
      id="experiencia"
      className="relative flex min-h-screen items-center py-28"
      aria-label="Experiência"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl rounded-3xl border border-white/5 bg-ink/45 p-8 backdrop-blur-md sm:p-12">
          <SectionHeading
            eyebrow={experience.eyebrow}
            title={experience.title}
            subtitle={experience.subtitle}
          />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {experience.highlights.map((item, i) => (
              <Reveal key={item} delay={0.1 + i * 0.06}>
                <li className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-volt" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-silver">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
