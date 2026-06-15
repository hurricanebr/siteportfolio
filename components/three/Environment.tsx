"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Environment map + tone mapping.
 *
 * - ACES Filmic: reproduz a curva de contraste das câmeras de cinema —
 *   highlights não estouram e sombras ganham detalhe, essencial para GLBs com PBR.
 * - environmentIntensity 1.8: deixa os reflexos metálicos bem visíveis
 *   sem precisar de luzes extras.
 */
export function SceneEnvironment() {
  const gl    = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    // Tone mapping fotorrealista (ACES Filmic é padrão na indústria de jogos/VFX)
    gl.toneMapping         = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;

    const pmrem  = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.environment          = envMap;
    scene.environmentIntensity = 1.8;

    return () => {
      gl.toneMapping         = THREE.NoToneMapping;
      gl.toneMappingExposure = 1.0;
      scene.environment      = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}
