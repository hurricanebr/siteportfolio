import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galaxy } from "@/content/site";

export function GalaxySection() {
  return (
    <section
      id="visao"
      className="relative flex min-h-screen items-center py-28"
      aria-label="Escala e visão"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow={galaxy.eyebrow}
            title={galaxy.title}
            subtitle={galaxy.subtitle}
            align="center"
          />

          <div className="mt-14 grid gap-4 text-left sm:grid-cols-2">
            {galaxy.phrases.map((phrase, i) => (
              <Reveal key={phrase} delay={0.1 + i * 0.08}>
                <blockquote className="h-full rounded-2xl border border-white/5 border-l-2 border-l-gilt/60 bg-ink/50 px-6 py-5 backdrop-blur-md">
                  <p className="text-sm leading-relaxed text-silver sm:text-base">
                    {phrase}
                  </p>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
