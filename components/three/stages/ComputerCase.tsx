"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { seededRandom, stageFade } from "@/lib/math";
import {
  brushedMetalNormalMap,
  brushedMetalRoughnessMap,
  brushedMetalTexture,
  pcbTexture,
  softCircleTexture,
  ventMeshTexture,
} from "../textures";

/**
 * Estágio 1 — gabinete gamer premium: estrutura preta fosca,
 * vidro temperado na frente e na lateral, interior visível com
 * fans RGB, water cooler, GPU e RAM iluminadas.
 * Some conforme a câmera atravessa o vidro frontal (p ≈ 0.18 → 0.30).
 *
 * Dimensões: 1.15 (x) × 2.1 (y) × 2.0 (z), centrado na origem.
 * Vidro: frente (+z) e lateral direita (+x). Placa-mãe na parede -x.
 */

const VOLT = 0x35e0ff;

type FadeMat = THREE.Material & { opacity: number };

function makeTubeGeometry(points: [number, number, number][]) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  );
  return new THREE.TubeGeometry(curve, 24, 0.018, 8);
}

export function ComputerCase({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const dust = useRef<THREE.Points>(null);
  const bladeRefs = useRef<(THREE.Group | null)[]>([]);
  const innerLight = useRef<THREE.PointLight>(null);

  const assets = useMemo(() => {
    const brushed = brushedMetalTexture();
    const normalMap = brushedMetalNormalMap();
    const roughnessMap = brushedMetalRoughnessMap();

    // ── Materiais (MeshPhysicalMaterial com normal map + clearcoat) ──────
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c1118,
      map: brushed,
      normalMap,
      normalScale: new THREE.Vector2(0.65, 0.65),
      roughnessMap,
      metalness: 0.92,
      roughness: 0.42,
      envMapIntensity: 1.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      transparent: true,
    });
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x090e15,
      map: brushed,
      normalMap,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap,
      metalness: 0.88,
      roughness: 0.48,
      envMapIntensity: 1.3,
      clearcoat: 0.2,
      clearcoatRoughness: 0.15,
      transparent: true,
    });
    const ventMat = new THREE.MeshPhysicalMaterial({
      color: 0x161e28,
      map: ventMeshTexture(),
      normalMap,
      normalScale: new THREE.Vector2(0.4, 0.4),
      metalness: 0.75,
      roughness: 0.52,
      envMapIntensity: 1.0,
      clearcoat: 0.15,
      clearcoatRoughness: 0.2,
      transparent: true,
    });
    // Vidro temperado com transmissão física real (não opacity: 0.3)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x080e16,
      transmission: 0.88,
      ior: 1.52,
      thickness: 0.1,
      roughness: 0.03,
      metalness: 0,
      envMapIntensity: 3.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      depthWrite: false,
    });
    const trayMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a4d62,
      map: pcbTexture(),
      metalness: 0.45,
      roughness: 0.55,
      envMapIntensity: 0.8,
      transparent: true,
    });
    const darkPartMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1520,
      normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      metalness: 0.78,
      roughness: 0.36,
      envMapIntensity: 1.1,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
      transparent: true,
    });
    const bladeMat = new THREE.MeshPhysicalMaterial({
      color: 0x18202c,
      normalMap,
      normalScale: new THREE.Vector2(0.25, 0.25),
      metalness: 0.6,
      roughness: 0.44,
      envMapIntensity: 0.9,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      transparent: true,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: VOLT,
      toneMapped: false,
      transparent: true,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      map: softCircleTexture(),
      color: VOLT,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const silverMat = new THREE.MeshPhysicalMaterial({
      color: 0xb0bece,
      metalness: 0.96,
      roughness: 0.22,
      envMapIntensity: 2.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.08,
      transparent: true,
    });
    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: softCircleTexture(),
      color: 0x2e6fff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── Geometrias reutilizadas ───────────────────────────────
    const fanBorderH = new THREE.BoxGeometry(0.5, 0.05, 0.09);
    const fanBorderV = new THREE.BoxGeometry(0.05, 0.4, 0.09);
    const bladeGeom = new THREE.BoxGeometry(0.04, 0.17, 0.014);
    const hubGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16);
    hubGeom.rotateX(Math.PI / 2);
    const ringGeom = new THREE.TorusGeometry(0.2, 0.013, 12, 40);
    const pumpRingGeom = new THREE.TorusGeometry(0.13, 0.014, 12, 36);
    const shroudRingGeom = new THREE.TorusGeometry(0.16, 0.012, 12, 36);
    const planeGeom = new THREE.PlaneGeometry(1, 1);
    const ioDotGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.015, 10);
    ioDotGeom.rotateX(Math.PI / 2);

    const tube1 = makeTubeGeometry([
      [-0.38, 0.5, 0.12],
      [-0.28, 0.72, 0.02],
      [-0.22, 0.88, -0.22],
      [-0.22, 0.9, -0.42],
    ]);
    const tube2 = makeTubeGeometry([
      [-0.38, 0.42, 0.18],
      [-0.25, 0.66, 0.12],
      [-0.18, 0.86, -0.12],
      [-0.18, 0.9, -0.35],
    ]);

    // Poeira luminosa ao redor do gabinete
    const dustCount = quality === "high" ? 220 : 90;
    const rng = seededRandom(11);
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const radius = 2.2 + rng() * 4.5;
      const theta = rng() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (rng() - 0.5) * 4.5;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      map: softCircleTexture(),
      color: 0x9fc6ff,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Opacidade-base de cada material (para o fade da jornada)
    // glassMat usa transmission física agora — base 1.0 (opacity=1 + transmission=0.88 = vidro real)
    const fadeMats: [FadeMat, number][] = [
      [frameMat, 1],
      [baseMat, 1],
      [ventMat, 1],
      [glassMat, 1],
      [trayMat, 1],
      [darkPartMat, 1],
      [bladeMat, 1],
      [glowMat, 1],
      [haloMat, 0.3],
      [silverMat, 1],
      [floorGlowMat, 0.3],
      [dustMat, 0.45],
    ];

    return {
      frameMat, baseMat, ventMat, glassMat, trayMat, darkPartMat,
      bladeMat, glowMat, haloMat, silverMat, floorGlowMat,
      fanBorderH, fanBorderV, bladeGeom, hubGeom, ringGeom, pumpRingGeom,
      shroudRingGeom, planeGeom, ioDotGeom, tube1, tube2,
      dustGeom, dustMat, fadeMats,
    };
  }, [quality]);

  useFrame((state, delta) => {
    const p = journeyState.smoothProgress;
    const fade = stageFade(p, -1, 0, 0.18, 0.3);

    if (group.current) group.current.visible = fade > 0.01;
    if (!group.current?.visible) return;

    const pulse = 0.82 + Math.sin(state.clock.elapsedTime * 1.8) * 0.18;
    for (const [mat, base] of assets.fadeMats) {
      mat.opacity = fade * base;
    }
    assets.glowMat.opacity = fade * pulse;
    assets.haloMat.opacity = fade * 0.3 * pulse;

    if (innerLight.current) innerLight.current.intensity = fade * 10;

    // Fans girando
    bladeRefs.current.forEach((blades, i) => {
      if (blades) blades.rotation.z += delta * (5.5 + i * 1.2);
    });

    if (dust.current) dust.current.rotation.y += delta * 0.02;
  });

  // Fan RGB completo (moldura, 7 pás, hub, anel de LED e halo)
  const fan = (position: [number, number, number], index: number) => (
    <group key={index} position={position}>
      {/* Moldura vazada do fan */}
      <mesh geometry={assets.fanBorderH} material={assets.darkPartMat} position={[0, 0.225, 0]} />
      <mesh geometry={assets.fanBorderH} material={assets.darkPartMat} position={[0, -0.225, 0]} />
      <mesh geometry={assets.fanBorderV} material={assets.darkPartMat} position={[-0.225, 0, 0]} />
      <mesh geometry={assets.fanBorderV} material={assets.darkPartMat} position={[0.225, 0, 0]} />
      <group
        position={[0, 0, 0.03]}
        ref={(el) => {
          bladeRefs.current[index] = el;
        }}
      >
        {Array.from({ length: 7 }, (_, b) => (
          <group key={b} rotation={[0, 0, (b / 7) * Math.PI * 2]}>
            <mesh
              geometry={assets.bladeGeom}
              material={assets.bladeMat}
              position={[0, 0.11, 0]}
              rotation={[0, 0.55, 0]}
            />
          </group>
        ))}
      </group>
      <mesh geometry={assets.hubGeom} material={assets.darkPartMat} position={[0, 0, 0.03]} />
      <mesh geometry={assets.ringGeom} material={assets.glowMat} position={[0, 0, 0.048]} />
      <mesh
        geometry={assets.planeGeom}
        material={assets.haloMat}
        position={[0, 0, 0.07]}
        scale={[0.85, 0.85, 1]}
      />
    </group>
  );

  return (
    <group ref={group}>
      {/* ── Base / shroud da fonte (terço inferior sólido) ── */}
      <mesh material={assets.baseMat} position={[0, -0.75, 0]}>
        <boxGeometry args={[1.15, 0.6, 2.0]} />
      </mesh>

      {/* I/O frontal na base */}
      {[-0.18, -0.1, -0.02, 0.06].map((x, i) => (
        <mesh
          key={i}
          geometry={assets.ioDotGeom}
          material={assets.silverMat}
          position={[x, -0.52, 1.005]}
        />
      ))}
      {/* Botão de energia com anel aceso */}
      <mesh position={[0.22, -0.52, 1.005]} material={assets.glowMat}>
        <torusGeometry args={[0.022, 0.005, 8, 24]} />
      </mesh>

      {/* ── Estrutura superior ── */}
      {/* Teto com malha de ventilação */}
      <mesh material={assets.ventMat} position={[0, 1.02, 0]}>
        <boxGeometry args={[1.15, 0.06, 2.0]} />
      </mesh>
      {/* Traseira ventilada */}
      <mesh material={assets.ventMat} position={[0, 0.3, -0.985]}>
        <boxGeometry args={[1.15, 1.5, 0.04]} />
      </mesh>
      {/* Parede esquerda (tray da placa-mãe, vista por fora) */}
      <mesh material={assets.frameMat} position={[-0.565, 0.3, 0]}>
        <boxGeometry args={[0.03, 1.5, 2.0]} />
      </mesh>
      {/* Pilares do vidro */}
      {(
        [
          [0.555, 0.975],
          [-0.555, 0.975],
          [0.555, -0.975],
        ] as const
      ).map(([px, pz], i) => (
        <mesh key={i} material={assets.frameMat} position={[px, 0.3, pz]}>
          <boxGeometry args={[0.045, 1.5, 0.045]} />
        </mesh>
      ))}
      {/* Rodapé do vidro (transição para a base) */}
      <mesh material={assets.frameMat} position={[0, -0.43, 0]}>
        <boxGeometry args={[1.15, 0.05, 2.0]} />
      </mesh>

      {/* ── Vidro temperado (frente e lateral direita) ── */}
      <mesh
        geometry={assets.planeGeom}
        material={assets.glassMat}
        position={[0, 0.3, 0.992]}
        scale={[1.06, 1.44, 1]}
      />
      <mesh
        geometry={assets.planeGeom}
        material={assets.glassMat}
        position={[0.572, 0.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[1.93, 1.44, 1]}
      />

      {/* ── Interior ── */}
      {/* Tray da placa-mãe (parede -x, virado para dentro) */}
      <mesh
        geometry={assets.planeGeom}
        material={assets.trayMat}
        position={[-0.545, 0.3, -0.05]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[1.8, 1.42, 1]}
      />

      {/* Fans frontais com anel RGB */}
      {fan([0, 0.55, 0.82], 0)}
      {fan([0, 0.02, 0.82], 1)}

      {/* Water cooler: pump na placa + mangueiras + radiador no teto */}
      <group position={[-0.48, 0.45, 0.05]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh material={assets.darkPartMat}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 24]} />
        </mesh>
        <mesh
          geometry={assets.pumpRingGeom}
          material={assets.glowMat}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.055, 0]}
        />
        <mesh
          geometry={assets.planeGeom}
          material={assets.haloMat}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.08, 0]}
          scale={[0.5, 0.5, 1]}
        />
      </group>
      <mesh geometry={assets.tube1} material={assets.darkPartMat} />
      <mesh geometry={assets.tube2} material={assets.darkPartMat} />
      {/* Radiador no teto */}
      <mesh material={assets.darkPartMat} position={[-0.2, 0.93, -0.15]}>
        <boxGeometry args={[0.24, 0.08, 1.0]} />
      </mesh>

      {/* GPU com friso de LED */}
      <mesh material={assets.darkPartMat} position={[-0.2, -0.05, 0.15]}>
        <boxGeometry args={[0.45, 0.14, 0.95]} />
      </mesh>
      <mesh material={assets.glowMat} position={[-0.2, 0.024, 0.6]}>
        <boxGeometry args={[0.42, 0.012, 0.02]} />
      </mesh>

      {/* Pentes de RAM com topo iluminado */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-0.46, 0.45, -0.28 - i * 0.07]}>
          <mesh material={assets.darkPartMat}>
            <boxGeometry args={[0.14, 0.55, 0.026]} />
          </mesh>
          <mesh material={assets.glowMat} position={[0.075, 0, 0]}>
            <boxGeometry args={[0.012, 0.55, 0.02]} />
          </mesh>
        </group>
      ))}

      {/* Anéis de luz no topo do shroud */}
      {[0.35, -0.25].map((z, i) => (
        <group key={i} position={[0.05, -0.443, z]}>
          <mesh
            geometry={assets.shroudRingGeom}
            material={assets.glowMat}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={assets.planeGeom}
            material={assets.haloMat}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.03, 0]}
            scale={[0.6, 0.6, 1]}
          />
        </group>
      ))}

      {/* Luz interna ciano que vaza pelo vidro */}
      <pointLight
        ref={innerLight}
        position={[0.05, 0.25, 0.3]}
        color={VOLT}
        intensity={6}
        distance={3.2}
        decay={2}
      />

      {/* Pés */}
      {(
        [
          [-0.42, 0.8],
          [0.42, 0.8],
          [-0.42, -0.8],
          [0.42, -0.8],
        ] as const
      ).map(([fx, fz], i) => (
        <mesh key={i} material={assets.baseMat} position={[fx, -1.085, fz]}>
          <boxGeometry args={[0.2, 0.07, 0.2]} />
        </mesh>
      ))}

      {/* Brilho suave sob o gabinete */}
      <mesh
        geometry={assets.planeGeom}
        material={assets.floorGlowMat}
        position={[0, -1.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[4.4, 4.4, 1]}
      />

      <points ref={dust} geometry={assets.dustGeom} material={assets.dustMat} />
    </group>
  );
}
