import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { micro } from "@/content/site";

export function MicroSection() {
  return (
    <section
      id="detalhe"
      className="relative flex min-h-screen items-center py-28"
      aria-label="Detalhe técnico"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl rounded-3xl border border-white/5 bg-ink/45 p-8 backdrop-blur-md sm:p-12">
          <SectionHeading
            eyebrow={micro.eyebrow}
            title={micro.title}
            subtitle={micro.subtitle}
          />

          <Reveal delay={0.15}>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {micro.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-silver transition-colors duration-200 hover:border-volt/40 hover:text-frost"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
