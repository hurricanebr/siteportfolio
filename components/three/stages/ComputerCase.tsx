"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { journeyState } from "@/lib/journey";
import { seededRandom, stageFade } from "@/lib/math";
import { softCircleTexture } from "../textures";

/**
 * Lightmap procedural: simula AO nos cantos e bounce-light ciano
 * dos LEDs RGB do interior. Aplicado apenas em meshes com UV1/UV2.
 */
function buildLightMap(): THREE.Texture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#c2cdd6";
  ctx.fillRect(0, 0, S, S);

  // AO suave nos cantos
  for (const [cx, cy] of [
    [0, 0], [S, 0], [0, S], [S, S],
  ] as [number, number][]) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.65);
    g.addColorStop(0, "rgba(0,0,0,0.44)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }

  // Bounce ciano dos fans / RGB no interior
  const bounce = ctx.createRadialGradient(
    S * 0.5, S * 0.3, 0,
    S * 0.5, S * 0.3, S * 0.48,
  );
  bounce.addColorStop(0, "rgba(53,224,255,0.24)");
  bounce.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bounce;
  ctx.fillRect(0, 0, S, S);

  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function ComputerCase({ quality }: { quality: "high" | "low" }) {
  const groupRef   = useRef<THREE.Group>(null);
  const innerLight = useRef<THREE.PointLight>(null);
  const dustRef    = useRef<THREE.Points>(null);

  const [gltfScene, setGltfScene] = useState<THREE.Group | null>(null);

  // Refs para animação de fade (evita closures desatualizadas no useFrame)
  const glbMatsRef  = useRef<THREE.Material[]>([]);
  const dustMatRef  = useRef<THREE.PointsMaterial | null>(null);
  const floorMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  // Ref paralela com opacidade base de cada material do GLB
  const glbBaseOpRef = useRef<number[]>([]);
  const gltfSceneRef = useRef<THREE.Group | null>(null);

  // Partículas de poeira + brilho sob o gabinete
  const { dustGeom, dustMat, floorMat } = useMemo(() => {
    const rng   = seededRandom(11);
    const count = quality === "high" ? 220 : 90;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + rng() * 4.5;
      const a = rng() * Math.PI * 2;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (rng() - 0.5) * 4.5;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const circle = softCircleTexture();
    const dm = new THREE.PointsMaterial({
      map: circle, color: 0x9fc6ff, size: 0.045,
      sizeAttenuation: true, transparent: true, opacity: 0.45,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const fm = new THREE.MeshBasicMaterial({
      map: circle, color: 0x2e6fff, transparent: true, opacity: 0.30,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    return { dustGeom: geom, dustMat: dm, floorMat: fm };
  }, [quality]);

  useEffect(() => {
    dustMatRef.current  = dustMat;
    floorMatRef.current = floorMat;
  }, [dustMat, floorMat]);

  // Carrega o modelo GLB com materiais PBR + lightmap
  useEffect(() => {
    const lightMap = buildLightMap();
    const loader   = new GLTFLoader();

    loader.load(
      "/gabinete.glb",
      (gltf) => {
        const root = gltf.scene;
        gltfSceneRef.current = root;

        // ── Auto-fit: escala e centra o modelo independente de como foi exportado ──
        // Mede o bounding box real do GLB
        const box    = new THREE.Box3().setFromObject(root);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Escala para que a altura corresponda ao gabinete procedural (~2.1 u)
        const TARGET_HEIGHT = 2.1;
        const sf = TARGET_HEIGHT / Math.max(size.y, 0.001);
        root.scale.setScalar(sf);

        // Centra na origem (compensando a escala)
        root.position.set(
          -center.x * sf,
          -center.y * sf,
          -center.z * sf,
        );

        console.info(
          `[ComputerCase] GLB ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)} → scale ${sf.toFixed(4)}`,
        );

        const seen    = new Set<THREE.Material>();
        const mats:   THREE.Material[] = [];
        const bases:  number[]         = [];

        root.traverse((node) => {
          if (!(node instanceof THREE.Mesh)) return;

          node.castShadow    = true;
          node.receiveShadow = true;

          const nodeMats: THREE.Material[] = Array.isArray(node.material)
            ? node.material
            : [node.material];

          // glTF 2.0: TEXCOORD_1 aparece como "uv1" no Three.js r136+
          const hasSecondUV =
            !!node.geometry.attributes.uv1 ||
            !!node.geometry.attributes.uv2;

          for (const m of nodeMats) {
            if (seen.has(m)) continue;
            seen.add(m);

            if (
              m instanceof THREE.MeshStandardMaterial ||
              m instanceof THREE.MeshPhysicalMaterial
            ) {
              // Potencializa reflexos do environment map
              m.envMapIntensity = 2.4;

              // Lightmap baked (AO + bounce) se o mesh tem UV2
              if (hasSecondUV) {
                m.lightMap          = lightMap;
                m.lightMapIntensity = 1.6;
              }
              m.needsUpdate = true;
            }

            // Transparência para o fade de scroll
            m.transparent = true;
            mats.push(m);
            bases.push((m as THREE.MeshStandardMaterial).opacity ?? 1);
          }
        });

        glbMatsRef.current   = mats;
        glbBaseOpRef.current = bases;
        setGltfScene(root);
      },
      undefined,
      (err) => console.warn("[ComputerCase] gabinete.glb:", err),
    );

    return () => {
      lightMap.dispose();
      glbMatsRef.current   = [];
      glbBaseOpRef.current = [];

      const root = gltfSceneRef.current;
      if (root) {
        root.traverse((node) => {
          if (!(node instanceof THREE.Mesh)) return;
          node.geometry.dispose();
          const ms = Array.isArray(node.material) ? node.material : [node.material];
          ms.forEach((m) => m.dispose());
        });
      }
    };
  }, []);

  useFrame((_, delta) => {
    const fade = stageFade(journeyState.smoothProgress, -1, 0, 0.18, 0.3);

    if (groupRef.current) groupRef.current.visible = fade > 0.01;
    if (!groupRef.current?.visible) return;

    // Fade materiais do GLB respeitando a opacidade original de cada um
    const mats  = glbMatsRef.current;
    const bases = glbBaseOpRef.current;
    for (let i = 0; i < mats.length; i++) {
      (mats[i] as THREE.MeshStandardMaterial).opacity = fade * (bases[i] ?? 1);
    }

    if (dustMatRef.current)  dustMatRef.current.opacity  = fade * 0.45;
    if (floorMatRef.current) floorMatRef.current.opacity = fade * 0.30;
    if (innerLight.current)  innerLight.current.intensity = fade * 10;
    if (dustRef.current)     dustRef.current.rotation.y  += delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      {gltfScene && <primitive object={gltfScene} />}

      {/* Luz interna ciano que simula o glow RGB */}
      <pointLight
        ref={innerLight}
        position={[0, 0.25, 0.3]}
        color={0x35e0ff}
        intensity={6}
        distance={3.2}
        decay={2}
      />

      {/* Brilho azul sob o gabinete */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.12, 0]}
        scale={4.4}
        material={floorMat}
      >
        <planeGeometry />
      </mesh>

      {/* Partículas de poeira luminosa ao redor */}
      <points ref={dustRef} geometry={dustGeom} material={dustMat} />
    </group>
  );
}
