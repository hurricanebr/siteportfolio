"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { clamp, seededRandom, stageFade } from "@/lib/math";
import {
  brushedMetalTexture,
  chipDieTexture,
  pcbTexture,
  softCircleTexture,
} from "../textures";

const BOARD_Z = -1.55;
const TRACE_Z = BOARD_Z + 0.035;
const CPU = { x: 0, y: -0.24 };

type TracePath = {
  points: THREE.Vector3[];
  /** Comprimentos acumulados para amostrar posições por arco. */
  cumulative: number[];
  total: number;
};

function buildTraces(count: number): TracePath[] {
  const rng = seededRandom(42);
  const paths: TracePath[] = [];

  for (let i = 0; i < count; i++) {
    // Cada trilha sai de uma borda do CPU e segue em ângulos retos,
    // como o roteamento de uma placa de circuito real.
    const horizontal = rng() > 0.5;
    const sign = rng() > 0.5 ? 1 : -1;
    let x = CPU.x + (horizontal ? sign * 0.27 : (rng() - 0.5) * 0.4);
    let y = CPU.y + (horizontal ? (rng() - 0.5) * 0.4 : sign * 0.27);

    const pts: THREE.Vector3[] = [new THREE.Vector3(x, y, TRACE_Z)];
    let axis: 0 | 1 = horizontal ? 0 : 1;
    const primaryAxis = axis;
    const segments = 2 + Math.floor(rng() * 2);

    for (let s = 0; s < segments; s++) {
      const length =
        axis === primaryAxis ? 0.35 + rng() * 0.75 : 0.15 + rng() * 0.45;
      const dir = axis === primaryAxis ? sign : rng() > 0.5 ? 1 : -1;
      if (axis === 0) x = clamp(x + dir * length, -1.25, 1.25);
      else y = clamp(y + dir * length, -1.0, 0.95);
      pts.push(new THREE.Vector3(x, y, TRACE_Z));
      axis = axis === 0 ? 1 : 0;
    }

    const cumulative = [0];
    let total = 0;
    for (let s = 1; s < pts.length; s++) {
      total += pts[s].distanceTo(pts[s - 1]);
      cumulative.push(total);
    }
    if (total > 0.01) paths.push({ points: pts, cumulative, total });
  }
  return paths;
}

function sampleTrace(path: TracePath, t: number, out: THREE.Vector3) {
  const target = t * path.total;
  let i = 1;
  while (i < path.cumulative.length - 1 && path.cumulative[i] < target) i++;
  const segStart = path.cumulative[i - 1];
  const segLength = path.cumulative[i] - segStart;
  const local = segLength > 0 ? (target - segStart) / segLength : 0;
  out.lerpVectors(path.points[i - 1], path.points[i], local);
}

/**
 * Estágio 2/3 — interior do gabinete: placa-mãe, componentes,
 * trilhas de cobre e pulsos de dados percorrendo os circuitos.
 * Visível entre p ≈ 0.16 e 0.64.
 */
export function Motherboard({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.Points>(null);

  const assets = useMemo(() => {
    const rng = seededRandom(7);

    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xc4d6ea,
      map: pcbTexture(),
      metalness: 0.35,
      roughness: 0.62,
      envMapIntensity: 0.8,
      transparent: true,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd7dee8,
      map: brushedMetalTexture(),
      roughnessMap: brushedMetalTexture(),
      metalness: 1.0,
      roughness: 0.32,
      envMapIntensity: 1.25,
      emissive: 0x0a1f2e,
      emissiveIntensity: 0.35,
      transparent: true,
    });
    const darkCompMat = new THREE.MeshStandardMaterial({
      color: 0x8194ac,
      map: chipDieTexture(),
      metalness: 0.55,
      roughness: 0.5,
      envMapIntensity: 0.9,
      transparent: true,
    });
    const traceMat = new THREE.LineBasicMaterial({
      color: 0x2bb8d9,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x16314f,
      transparent: true,
      opacity: 0.35,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      map: softCircleTexture(),
      color: 0x3ce0ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Trilhas de cobre
    const traceCount = quality === "high" ? 22 : 12;
    const traces = buildTraces(traceCount);
    const tracePositions: number[] = [];
    for (const path of traces) {
      for (let i = 1; i < path.points.length; i++) {
        tracePositions.push(
          path.points[i - 1].x, path.points[i - 1].y, path.points[i - 1].z,
          path.points[i].x, path.points[i].y, path.points[i].z,
        );
      }
    }
    const traceGeom = new THREE.BufferGeometry();
    traceGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(tracePositions, 3),
    );

    // Grade sutil sobre a placa
    const gridPositions: number[] = [];
    for (let gx = -1.2; gx <= 1.21; gx += 0.3) {
      gridPositions.push(gx, -1.0, TRACE_Z - 0.005, gx, 0.95, TRACE_Z - 0.005);
    }
    for (let gy = -1.0; gy <= 0.96; gy += 0.3) {
      gridPositions.push(-1.2, gy, TRACE_Z - 0.005, 1.2, gy, TRACE_Z - 0.005);
    }
    const gridGeom = new THREE.BufferGeometry();
    gridGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(gridPositions, 3),
    );

    // Pulsos de dados que viajam pelas trilhas
    const pulseCount = quality === "high" ? 26 : 12;
    const pulseData = Array.from({ length: pulseCount }, (_, i) => ({
      path: i % traces.length,
      offset: rng(),
      speed: 0.12 + rng() * 0.25,
    }));
    const pulseGeom = new THREE.BufferGeometry();
    const pulseArray = new Float32Array(pulseCount * 3);
    const pulseAttr = new THREE.BufferAttribute(pulseArray, 3);
    pulseAttr.setUsage(THREE.DynamicDrawUsage);
    pulseGeom.setAttribute("position", pulseAttr);
    const pulseMat = new THREE.PointsMaterial({
      map: softCircleTexture(),
      color: 0x5fe9ff,
      size: 0.075,
      sizeAttenuation: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Capacitores espalhados pela placa
    const capCount = quality === "high" ? 26 : 12;
    const capGeom = new THREE.CylinderGeometry(0.024, 0.024, 0.07, 10);
    const capPositions: [number, number][] = [];
    while (capPositions.length < capCount) {
      const cx = (rng() - 0.5) * 2.3;
      const cy = (rng() - 0.5) * 1.8;
      // evita a região do CPU e da GPU
      if (Math.abs(cx - CPU.x) < 0.45 && Math.abs(cy - CPU.y) < 0.45) continue;
      if (cy < -0.6 && cx < 0.4) continue;
      capPositions.push([cx, cy]);
    }

    return {
      boardMat, metalMat, darkCompMat, traceMat, gridMat, glowMat,
      traceGeom, gridGeom, traces,
      pulseGeom, pulseMat, pulseData, pulseArray, pulseAttr,
      capGeom, capPositions,
    };
  }, [quality]);

  const sampleVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const p = journeyState.smoothProgress;
    const fade = stageFade(p, 0.16, 0.26, 0.55, 0.64);

    if (group.current) group.current.visible = fade > 0.01;
    if (!group.current?.visible) return;

    assets.boardMat.opacity = fade;
    assets.metalMat.opacity = fade;
    assets.darkCompMat.opacity = fade;
    assets.traceMat.opacity = fade * 0.55;
    assets.gridMat.opacity = fade * 0.12;
    assets.glowMat.opacity = fade * 0.4;
    assets.pulseMat.opacity = fade;

    // Move os pulsos ao longo das trilhas
    const time = state.clock.elapsedTime;
    for (let i = 0; i < assets.pulseData.length; i++) {
      const pulse = assets.pulseData[i];
      const t = (time * pulse.speed + pulse.offset) % 1;
      sampleTrace(assets.traces[pulse.path], t, sampleVec);
      assets.pulseArray[i * 3] = sampleVec.x;
      assets.pulseArray[i * 3 + 1] = sampleVec.y;
      assets.pulseArray[i * 3 + 2] = sampleVec.z + 0.01;
    }
    assets.pulseAttr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      {/* Placa-mãe */}
      <mesh material={assets.boardMat} position={[0, -0.1, BOARD_Z]}>
        <boxGeometry args={[2.6, 2.15, 0.05]} />
      </mesh>

      <lineSegments
        geometry={assets.gridGeom}
        material={assets.gridMat}
        position={[0, -0.1, 0]}
      />
      <lineSegments
        geometry={assets.traceGeom}
        material={assets.traceMat}
        position={[0, 0, 0]}
      />

      {/* CPU */}
      <mesh material={assets.metalMat} position={[CPU.x, CPU.y, BOARD_Z + 0.065]}>
        <boxGeometry args={[0.46, 0.46, 0.07]} />
      </mesh>
      <mesh
        material={assets.glowMat}
        position={[CPU.x, CPU.y, BOARD_Z + 0.11]}
        scale={[1.1, 1.1, 1]}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Pentes de RAM */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          material={assets.darkCompMat}
          position={[0.68 + i * 0.1, 0.18, BOARD_Z + 0.07]}
        >
          <boxGeometry args={[0.055, 0.95, 0.09]} />
        </mesh>
      ))}

      {/* GPU */}
      <mesh material={assets.darkCompMat} position={[-0.38, -0.88, BOARD_Z + 0.11]}>
        <boxGeometry args={[1.25, 0.27, 0.16]} />
      </mesh>

      {/* Capacitores */}
      {assets.capPositions.map(([cx, cy], i) => (
        <mesh
          key={i}
          geometry={assets.capGeom}
          material={assets.darkCompMat}
          position={[cx, cy, BOARD_Z + 0.06]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}

      {/* Pulsos de dados */}
      <points
        ref={pulsesRef}
        geometry={assets.pulseGeom}
        material={assets.pulseMat}
      />
    </group>
  );
}
