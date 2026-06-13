"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { range, seededRandom } from "@/lib/math";
import { softCircleTexture } from "../textures";

const CENTER: [number, number, number] = [0, -0.9, -30];

/**
 * Estágio 6 — galáxia digital inspirada na Via Láctea.
 * Surge a partir de p ≈ 0.84 e permanece como fundo vivo
 * para as seções finais da página.
 */
export function Galaxy({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const spiral = useRef<THREE.Points>(null);

  const assets = useMemo(() => {
    const rng = seededRandom(2024);
    const count = quality === "high" ? 15000 : 5500;
    const radius = 9.5;
    const branches = 4;
    const spin = 1.15;
    const randomness = 0.32;
    const randomnessPower = 2.8;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorInside = new THREE.Color(0x9fdcff);
    const colorMid = new THREE.Color(0x3b7bff);
    const colorOutside = new THREE.Color(0x16294f);
    const colorGold = new THREE.Color(0xe3c46b);
    const mixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = Math.pow(rng(), 0.8) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      const randX =
        Math.pow(rng(), randomnessPower) * (rng() < 0.5 ? 1 : -1) * randomness * r;
      const randY =
        Math.pow(rng(), randomnessPower) * (rng() < 0.5 ? 1 : -1) * randomness * r * 0.45;
      const randZ =
        Math.pow(rng(), randomnessPower) * (rng() < 0.5 ? 1 : -1) * randomness * r;

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + randX;
      positions[i * 3 + 1] = randY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ;

      // Dourado discreto em ~2% das estrelas
      if (rng() < 0.02) {
        mixed.copy(colorGold);
      } else {
        const t = r / radius;
        if (t < 0.5) mixed.copy(colorInside).lerp(colorMid, t * 2);
        else mixed.copy(colorMid).lerp(colorOutside, (t - 0.5) * 2);
      }
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      map: softCircleTexture(),
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });

    const coreMat = new THREE.MeshBasicMaterial({
      map: softCircleTexture(),
      color: 0xbfe6ff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });

    return { geom, mat, coreMat };
  }, [quality]);

  useFrame((_, delta) => {
    const p = journeyState.smoothProgress;
    const fade = range(p, 0.84, 0.96);

    if (group.current) group.current.visible = fade > 0.005;
    if (!group.current?.visible) return;

    assets.mat.opacity = fade * 0.95;
    assets.coreMat.opacity = fade * 0.5;

    if (spiral.current) spiral.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group} position={CENTER} rotation={[-0.42, 0, 0.1]}>
      <points ref={spiral} geometry={assets.geom} material={assets.mat} />
      {/* Núcleo luminoso */}
      <mesh material={assets.coreMat} rotation={[-Math.PI / 2, 0, 0]} scale={[5, 5, 1]}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}
