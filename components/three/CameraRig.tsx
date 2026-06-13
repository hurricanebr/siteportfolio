"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { journeyState, readJourneyProgress } from "@/lib/journey";
import { smooth } from "@/lib/math";

type CameraKey = {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
};

/**
 * Roteiro da câmera (progresso 0 → 1):
 * gabinete → atravessa o painel → placa-mãe → CPU →
 * cidade de silício (chip) → partículas → galáxia digital.
 */
const KEYS: CameraKey[] = [
  { p: 0.0, pos: [1.1, 0.65, 5.2], look: [-0.85, 0.05, 0] },
  { p: 0.14, pos: [0.55, 0.3, 3.3], look: [-0.35, 0.05, 0] },
  { p: 0.27, pos: [0.0, 0.1, 1.0], look: [0, -0.05, -1.5] },
  { p: 0.41, pos: [0.3, -0.05, -0.1], look: [0.05, -0.25, -1.5] },
  { p: 0.53, pos: [0.05, -0.16, -0.85], look: [0, -0.24, -1.5] },
  { p: 0.66, pos: [0, 0.25, -8.5], look: [0, -0.2, -13] },
  { p: 0.8, pos: [0, 0.7, -14.5], look: [0, 0.2, -20] },
  { p: 1.0, pos: [0, 3.0, -21.0], look: [0, -0.8, -30] },
];

export function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 });
  const vectors = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    journeyState.progress = readJourneyProgress();

    // Amortecimento independente de framerate
    const damp = 1 - Math.exp(-4 * delta);
    journeyState.smoothProgress +=
      (journeyState.progress - journeyState.smoothProgress) * damp;
    const p = journeyState.smoothProgress;

    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const k0 = KEYS[i];
    const k1 = KEYS[i + 1];
    const t = smooth((p - k0.p) / (k1.p - k0.p));

    vectors.a.fromArray(k0.pos);
    vectors.b.fromArray(k1.pos);
    vectors.pos.lerpVectors(vectors.a, vectors.b, t);

    vectors.a.fromArray(k0.look);
    vectors.b.fromArray(k1.look);
    vectors.look.lerpVectors(vectors.a, vectors.b, t);

    // Parallax sutil do ponteiro (também amortecido)
    const pointerDamp = 1 - Math.exp(-3 * delta);
    pointer.current.x += (journeyState.pointerX - pointer.current.x) * pointerDamp;
    pointer.current.y += (journeyState.pointerY - pointer.current.y) * pointerDamp;

    vectors.pos.x += pointer.current.x * 0.14;
    vectors.pos.y += -pointer.current.y * 0.1;
    vectors.look.x += pointer.current.x * 0.32;
    vectors.look.y += -pointer.current.y * 0.22;

    state.camera.position.copy(vectors.pos);
    state.camera.lookAt(vectors.look);
  });

  return null;
}
