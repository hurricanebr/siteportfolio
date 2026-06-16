"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState } from "@/lib/journey";
import { seededRandom, stageFade } from "@/lib/math";
import { softCircleTexture } from "../textures";

const GREEN = 0x00ff88;

/** Layout dos 3 racks: posição central X, leve rotação para dar profundidade. */
const RACKS: { x: number; ry: number }[] = [
  { x: -1.35, ry: 0.26 },
  { x: 0, ry: 0 },
  { x: 1.35, ry: -0.26 },
];

const RACK_W = 0.9;
const RACK_H = 2.2;
const RACK_D = 0.7;
const SLOTS = 12; // servidores empilhados por rack

/**
 * Estágio 1 — datacenter abstrato. Substitui o antigo gabinete (GLB):
 * 3 racks em wireframe verde com servidores empilhados, LEDs de status
 * pulsando e partículas de dados subindo verticalmente.
 *
 * 100% procedural — nenhum asset de rede, renderiza no primeiro frame.
 * Visível em p ≈ 0 e some entre 0.18 e 0.3 (mesma curva do gabinete anterior).
 */
export function DatacenterStage({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Points>(null);
  const dataRef = useRef<THREE.Points>(null);

  const assets = useMemo(() => {
    const rng = seededRandom(7);

    // ── Wireframe dos racks + slots de servidores ──
    const rackPositions: number[] = [];
    const slotPitch = RACK_H / (SLOTS + 1);

    // Cantos de uma box centrada na origem
    const hw = RACK_W / 2;
    const hd = RACK_D / 2;

    for (const rack of RACKS) {
      // Matriz de transformação do rack (posição + rotação Y)
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(rack.x, 0, 0),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rack.ry, 0)),
        new THREE.Vector3(1, 1, 1),
      );

      const v = new THREE.Vector3();
      const push = (x: number, y: number, z: number) => {
        v.set(x, y, z).applyMatrix4(m);
        rackPositions.push(v.x, v.y, v.z);
      };
      const edge = (
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number,
      ) => {
        push(ax, ay, az);
        push(bx, by, bz);
      };

      const top = RACK_H / 2;
      const bot = -RACK_H / 2;

      // 4 arestas verticais
      for (const [sx, sz] of [
        [-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd],
      ] as [number, number][]) {
        edge(sx, bot, sz, sx, top, sz);
      }

      // Slots horizontais (servidores empilhados) — anel frontal + traseiro
      for (let s = 0; s <= SLOTS; s++) {
        const y = bot + s * slotPitch;
        edge(-hw, y, -hd, hw, y, -hd); // frente
        edge(-hw, y, hd, hw, y, hd);   // trás
        edge(-hw, y, -hd, -hw, y, hd); // lateral esq
        edge(hw, y, -hd, hw, y, hd);   // lateral dir
      }
    }

    const rackGeom = new THREE.BufferGeometry();
    rackGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(rackPositions, 3),
    );
    const rackMat = new THREE.LineBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── LEDs de status: um por slot na face frontal de cada rack ──
    const circle = softCircleTexture();
    const ledPos: number[] = [];
    for (const rack of RACKS) {
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(rack.x, 0, 0),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rack.ry, 0)),
        new THREE.Vector3(1, 1, 1),
      );
      const v = new THREE.Vector3();
      for (let s = 0; s < SLOTS; s++) {
        const y = -RACK_H / 2 + (s + 0.5) * slotPitch;
        const lx = -hw + 0.12 + rng() * 0.1;
        v.set(lx, y, hd + 0.01).applyMatrix4(m);
        ledPos.push(v.x, v.y, v.z);
      }
    }
    const ledGeom = new THREE.BufferGeometry();
    ledGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ledPos, 3),
    );
    const ledMat = new THREE.PointsMaterial({
      map: circle,
      color: GREEN,
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── Partículas de dados subindo verticalmente dentro/ao redor dos racks ──
    const dataCount = quality === "high" ? 400 : 150;
    const dataArr = new Float32Array(dataCount * 3);
    const dataSpeed = new Float32Array(dataCount);
    for (let i = 0; i < dataCount; i++) {
      const rack = RACKS[Math.floor(rng() * RACKS.length)];
      dataArr[i * 3] = rack.x + (rng() - 0.5) * (RACK_W + 0.4);
      dataArr[i * 3 + 1] = (rng() - 0.5) * (RACK_H + 0.6);
      dataArr[i * 3 + 2] = (rng() - 0.5) * (RACK_D + 0.4);
      dataSpeed[i] = 0.4 + rng() * 0.9;
    }
    const dataGeom = new THREE.BufferGeometry();
    const dataAttr = new THREE.BufferAttribute(dataArr, 3);
    dataAttr.setUsage(THREE.DynamicDrawUsage);
    dataGeom.setAttribute("position", dataAttr);
    const dataMat = new THREE.PointsMaterial({
      map: circle,
      color: GREEN,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── Brilho verde no chão sob os racks ──
    const floorMat = new THREE.MeshBasicMaterial({
      map: circle,
      color: 0x10b070,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return {
      rackGeom, rackMat,
      ledGeom, ledMat,
      dataGeom, dataMat, dataArr, dataAttr, dataSpeed, dataCount,
      floorMat,
    };
  }, [quality]);

  useFrame((state, delta) => {
    const fade = stageFade(journeyState.smoothProgress, -1, 0, 0.18, 0.3);

    if (group.current) group.current.visible = fade > 0.01;
    if (!group.current?.visible) return;

    const t = state.clock.elapsedTime;

    assets.rackMat.opacity = fade * 0.85;
    assets.floorMat.opacity = fade * 0.32;

    // LEDs piscam num pulso global suave (additive blending dá o glow)
    const pulse = 0.6 + Math.sin(t * 2.4) * 0.25;
    assets.ledMat.opacity = fade * pulse;

    // Partículas de dados sobem; reiniciam na base ao passar o topo
    const half = (RACK_H + 0.6) / 2;
    for (let i = 0; i < assets.dataCount; i++) {
      let y = assets.dataArr[i * 3 + 1] + assets.dataSpeed[i] * delta;
      if (y > half) y = -half;
      assets.dataArr[i * 3 + 1] = y;
    }
    assets.dataAttr.needsUpdate = true;
    assets.dataMat.opacity = fade * 0.85;

    if (dataRef.current) dataRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={assets.rackGeom} material={assets.rackMat} />
      <points ref={ledRef} geometry={assets.ledGeom} material={assets.ledMat} />
      <points ref={dataRef} geometry={assets.dataGeom} material={assets.dataMat} />

      {/* Brilho verde sob os racks */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -RACK_H / 2 - 0.05, 0]}
        scale={5}
        material={assets.floorMat}
      >
        <planeGeometry />
      </mesh>

      {/* Glow ambiente verde do datacenter */}
      <pointLight position={[0, 0, 1.2]} color={GREEN} intensity={6} distance={5} decay={2} />
    </group>
  );
}
