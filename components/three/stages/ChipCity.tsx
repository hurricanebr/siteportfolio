"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { seededRandom, stageFade } from "@/lib/math";
import { chipDieTexture, softCircleTexture } from "../textures";

const FLOOR_Y = -1.3;
const AREA = { x: 6.5, zNear: -8, zFar: -19 };

/**
 * Estágio 4 — interior do chip em escala microscópica:
 * blocos de silício como uma cidade de transistores, com
 * pulsos de dados subindo da estrutura.
 * Visível entre p ≈ 0.55 e 0.84.
 */
export function ChipCity({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);

  const assets = useMemo(() => {
    const rng = seededRandom(99);
    const count = quality === "high" ? 760 : 300;

    const blockGeom = new THREE.BoxGeometry(0.3, 1, 0.3);
    const die = chipDieTexture();
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x9cb2cc,
      map: die,
      metalness: 0.7,
      roughness: 0.42,
      envMapIntensity: 1.0,
      emissive: 0x18c4e8,
      emissiveMap: die,
      emissiveIntensity: 0.55,
      transparent: true,
    });

    // Posições/alturas dos blocos (corredor central liberado p/ a câmera)
    const transforms: { x: number; z: number; h: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = (rng() - 0.5) * AREA.x * 2;
      const z = AREA.zNear - rng() * (AREA.zNear - AREA.zFar);
      const corridor = Math.abs(x) < 0.7;
      const h = corridor ? 0.1 + rng() * 0.25 : 0.15 + rng() * 1.6;
      transforms.push({ x, z, h });
    }

    // Grade do "die" no chão
    const gridPositions: number[] = [];
    for (let gx = -AREA.x; gx <= AREA.x + 0.01; gx += 0.6) {
      gridPositions.push(gx, FLOOR_Y, AREA.zNear, gx, FLOOR_Y, AREA.zFar);
    }
    for (let gz = AREA.zFar; gz <= AREA.zNear + 0.01; gz += 0.6) {
      gridPositions.push(-AREA.x, FLOOR_Y, gz, AREA.x, FLOOR_Y, gz);
    }
    const gridGeom = new THREE.BufferGeometry();
    gridGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(gridPositions, 3),
    );
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x10455e,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    // Fagulhas de dados subindo
    const sparkCount = quality === "high" ? 480 : 180;
    const sparkArray = new Float32Array(sparkCount * 3);
    const sparkSpeeds = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      sparkArray[i * 3] = (rng() - 0.5) * AREA.x * 2;
      sparkArray[i * 3 + 1] = FLOOR_Y + rng() * 3.4;
      sparkArray[i * 3 + 2] = AREA.zNear - rng() * (AREA.zNear - AREA.zFar);
      sparkSpeeds[i] = 0.15 + rng() * 0.5;
    }
    const sparkGeom = new THREE.BufferGeometry();
    const sparkAttr = new THREE.BufferAttribute(sparkArray, 3);
    sparkAttr.setUsage(THREE.DynamicDrawUsage);
    sparkGeom.setAttribute("position", sparkAttr);
    const sparkMat = new THREE.PointsMaterial({
      map: softCircleTexture(),
      color: 0x57e6ff,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return {
      blockGeom, blockMat, transforms, count,
      gridGeom, gridMat,
      sparkGeom, sparkMat, sparkArray, sparkAttr, sparkSpeeds, sparkCount,
    };
  }, [quality]);

  useEffect(() => {
    const mesh = instances.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    assets.transforms.forEach((t, i) => {
      dummy.position.set(t.x, FLOOR_Y + t.h / 2, t.z);
      dummy.scale.set(1, t.h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [assets]);

  useFrame((state, delta) => {
    const p = journeyState.smoothProgress;
    const fade = stageFade(p, 0.55, 0.64, 0.76, 0.84);

    if (group.current) group.current.visible = fade > 0.01;
    if (!group.current?.visible) return;

    assets.blockMat.opacity = fade;
    assets.gridMat.opacity = fade * 0.4;
    assets.sparkMat.opacity = fade * 0.8;

    // Pulso de processamento
    assets.blockMat.emissiveIntensity =
      0.55 + Math.sin(state.clock.elapsedTime * 2.2) * 0.25;

    // Fagulhas sobem e reiniciam na base
    for (let i = 0; i < assets.sparkCount; i++) {
      let y = assets.sparkArray[i * 3 + 1] + assets.sparkSpeeds[i] * delta;
      if (y > FLOOR_Y + 3.6) y = FLOOR_Y;
      assets.sparkArray[i * 3 + 1] = y;
    }
    assets.sparkAttr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={instances}
        args={[assets.blockGeom, assets.blockMat, assets.count]}
      />
      <lineSegments geometry={assets.gridGeom} material={assets.gridMat} />
      <points geometry={assets.sparkGeom} material={assets.sparkMat} />
    </group>
  );
}
