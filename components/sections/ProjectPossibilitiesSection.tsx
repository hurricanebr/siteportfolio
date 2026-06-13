import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/site";

export function ProjectPossibilitiesSection() {
  return (
    <section
      id="projetos"
      className="relative py-28"
      aria-label="Projetos e possibilidades"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          subtitle={projects.subtitle}
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {projects.items.map((project, i) => (
            <Reveal key={project.type} delay={0.04 + (i % 2) * 0.06}>
              <li className="h-full">
                <GlassCard interactive className="flex h-full flex-col gap-4">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-frost">
                    {project.type}
                  </h3>
                  <dl className="flex flex-col gap-3 text-sm leading-relaxed">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-steel/80">
                        Problema
                      </dt>
                      <dd className="mt-1 text-steel">{project.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-volt/80">
                        Solução
                      </dt>
                      <dd className="mt-1 text-silver">{project.solution}</dd>
                    </div>
                  </dl>
                  <p className="mt-auto border-t border-white/5 pt-3 text-sm italic text-gilt/90">
                    {project.benefit}
                  </p>
                </GlassCard>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
