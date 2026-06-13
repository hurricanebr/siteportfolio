import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Nível do heading para manter a hierarquia semântica. */
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Heading = "h2",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col gap-5 ${alignment}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-volt/20 bg-volt/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-volt">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <Heading className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-frost sm:text-4xl lg:text-5xl">
          {title}
        </Heading>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base leading-relaxed text-steel sm:text-lg ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
