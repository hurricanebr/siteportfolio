import { GlassCard } from "@/components/ui/GlassCard";
import { iconMap } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/site";

export function ServicesSection() {
  return (
    <section id="servicos" className="relative py-28" aria-label="Serviços">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          subtitle={services.subtitle}
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <Reveal key={service.title} delay={0.05 + i * 0.05}>
                <li className="h-full">
                  <GlassCard interactive className="flex h-full flex-col gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-volt/20 bg-volt/10">
                      {Icon ? (
                        <Icon className="h-5 w-5 text-volt" aria-hidden="true" />
                      ) : null}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-frost">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-steel">
                      {service.description}
                    </p>
                  </GlassCard>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
