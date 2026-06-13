"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { seededRandom, stageFade } from "@/lib/math";
import { softCircleTexture } from "../textures";

const CENTER: [number, number, number] = [0, 0.4, -19.5];

/**
 * Estágio 5 — nuvem de partículas de dados em escala microscópica.
 * A câmera atravessa a nuvem antes de ela "se abrir" na galáxia.
 * Visível entre p ≈ 0.7 e 0.95.
 */
export function MicroParticles({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Points>(null);

  const assets = useMemo(() => {
    const rng = seededRandom(31);
    const count = quality === "high" ? 2600 : 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x3ce0ff),
      new THREE.Color(0x2e6fff),
      new THREE.Color(0xdce9f7),
      new THREE.Color(0x7aa8ff),
    ];

    for (let i = 0; i < count; i++) {
      // Distribuição esférica com leve adensamento no centro
      const radius = Math.pow(rng(), 0.65) * 5.2;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.75;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(rng() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      map: softCircleTexture(),
      size: 0.055,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });

    return { geom, mat };
  }, [quality]);

  useFrame((_, delta) => {
    const p = journeyState.smoothProgress;
    const fade = stageFade(p, 0.7, 0.79, 0.87, 0.95);

    if (group.current) group.current.visible = fade > 0.01;
    if (!group.current?.visible) return;

    assets.mat.opacity = fade * 0.9;

    if (cloud.current) {
      cloud.current.rotation.y += delta * 0.03;
      cloud.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <group ref={group}>
      <points
        ref={cloud}
        geometry={assets.geom}
        material={assets.mat}
        position={CENTER}
      />
    </group>
  );
}
