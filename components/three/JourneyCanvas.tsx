"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { measureJourney } from "@/lib/journey";
import { CameraRig } from "./CameraRig";
import { SceneEnvironment } from "./Environment";
import { ChipCity } from "./stages/ChipCity";
import { DatacenterStage } from "./stages/DatacenterStage";
import { Galaxy } from "./stages/Galaxy";
import { MicroParticles } from "./stages/MicroParticles";
import { Motherboard } from "./stages/Motherboard";

/**
 * Canvas WebGL fixo atrás do conteúdo. A câmera percorre a jornada
 * gabinete → placa-mãe → chip → partículas → galáxia conforme o scroll.
 */
export default function JourneyCanvas() {
  const [quality, setQuality] = useState<"high" | "low" | null>(null);

  useEffect(() => {
    setQuality(window.innerWidth < 768 ? "low" : "high");
    measureJourney();
  }, []);

  if (!quality) return null;

  return (
    <Canvas
      camera={{ fov: 50, near: 0.1, far: 90, position: [1.7, 0.8, 6.6] }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#04060d", 8, 75]} />

      <SceneEnvironment />
      <ambientLight intensity={0.22} />
      {/* Key light superior-direita: ilumina o topo do gabinete e cria specular */}
      <directionalLight position={[3.5, 7, 4]} intensity={2.2} color="#d0e4ff" />
      {/* Fill light esquerda-frente: ilumina o vidro temperado */}
      <directionalLight position={[-2, 3, 5]} intensity={1.4} color="#c8d8f0" />
      {/* Rim light: separa o gabinete preto do fundo escuro */}
      <directionalLight position={[-5, 2, -4]} intensity={2.8} color="#7fa8e8" />
      <pointLight position={[2.5, 1.5, 2.5]} intensity={40} color="#3ce0ff" />
      <pointLight position={[-3, -0.5, 0.5]} intensity={26} color="#2e6fff" />

      <CameraRig />
      <DatacenterStage quality={quality} />
      <Motherboard quality={quality} />
      <ChipCity quality={quality} />
      <MicroParticles quality={quality} />
      <Galaxy quality={quality} />
    </Canvas>
  );
}
