import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ChipSection } from "@/components/sections/ChipSection";
import { CircuitSection } from "@/components/sections/CircuitSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { GalaxySection } from "@/components/sections/GalaxySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { MicroSection } from "@/components/sections/MicroSection";
import { ProjectPossibilitiesSection } from "@/components/sections/ProjectPossibilitiesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ScrollScene } from "@/components/three/ScrollScene";

export default function Home() {
  return (
    <>
      {/* Fundo 3D fixo — a jornada gabinete → galáxia */}
      <ScrollScene />
      <Navbar />

      <main className="relative z-10">
        {/* A jornada de scroll que controla a câmera 3D */}
        <div id="journey">
          <HeroSection />
          <ExperienceSection />
          <CircuitSection />
          <ChipSection />
          <MicroSection />
          <GalaxySection />
        </div>

        {/* Seções de conteúdo sobre fundo mais sólido (galáxia ao fundo) */}
        <div
          className="relative"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(4,6,13,0.88) 6%, rgba(4,6,13,0.92) 100%)",
          }}
        >
          <ServicesSection />
          <MethodSection />
          <ProjectPossibilitiesSection />
          <DifferentialsSection />
          <FAQSection />
        </div>

        {/* Contato com a galáxia novamente visível */}
        <div
          className="relative"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,6,13,0.92) 0%, rgba(4,6,13,0.45) 35%, rgba(4,6,13,0.7) 100%)",
          }}
        >
          <ContactSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
