import * as THREE from "three";

let circleCache: THREE.Texture | null = null;

/** Sprite circular suave usado por todas as partículas da cena. */
export function softCircleTexture() {
  if (circleCache) return circleCache;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  circleCache = texture;
  return texture;
}

function makeCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function finishTexture(canvas: HTMLCanvasElement, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

let brushedCache: THREE.Texture | null = null;

/**
 * Metal escovado procedural — usado como map e roughnessMap
 * do gabinete e do heatspreader do CPU.
 */
export function brushedMetalTexture() {
  if (brushedCache) return brushedCache;
  const size = 512;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#79828f";
  ctx.fillRect(0, 0, size, size);

  // Riscos horizontais finos típicos do acabamento escovado
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * size;
    const x = Math.random() * size - 120;
    const width = 50 + Math.random() * 320;
    const light = 92 + Math.floor(Math.random() * 70);
    ctx.strokeStyle = `rgba(${light},${light + 5},${light + 12},${
      0.05 + Math.random() * 0.12
    })`;
    ctx.lineWidth = 0.5 + Math.random() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
  }

  // Variações largas de tom para quebrar a uniformidade
  for (let i = 0; i < 18; i++) {
    const y = Math.random() * size;
    const h = 20 + Math.random() * 90;
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "10,16,26"},${
      0.02 + Math.random() * 0.04
    })`;
    ctx.fillRect(0, y, size, h);
  }

  brushedCache = finishTexture(canvas);
  return brushedCache;
}

let ventCache: THREE.Texture | null = null;

/** Malha de ventilação perfurada (topo e traseira do gabinete). */
export function ventMeshTexture() {
  if (ventCache) return ventCache;
  const size = 256;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#12161d";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#04060a";
  for (let y = 6; y < size; y += 12) {
    for (let x = 6; x < size; x += 12) {
      const offset = (Math.floor(y / 12) % 2) * 6;
      ctx.beginPath();
      ctx.arc(x + offset, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ventCache = finishTexture(canvas);
  ventCache.repeat.set(3, 3);
  return ventCache;
}

let pcbCache: THREE.Texture | null = null;

/**
 * Textura de PCB — substrato escuro com trilhas de cobre,
 * vias, pads e chips menores, como uma placa-mãe real.
 */
export function pcbTexture() {
  if (pcbCache) return pcbCache;
  const size = 1024;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0a1626";
  ctx.fillRect(0, 0, size, size);

  // Ruído sutil do substrato
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(120,160,210,${0.01 + Math.random() * 0.02})`;
    ctx.fillRect(
      Math.random() * size,
      Math.random() * size,
      2 + Math.random() * 14,
      2 + Math.random() * 14,
    );
  }

  // Trilhas em ângulos retos (algumas em barramentos paralelos)
  ctx.lineCap = "round";
  for (let i = 0; i < 200; i++) {
    const bus = Math.random() < 0.25 ? 3 + Math.floor(Math.random() * 3) : 1;
    let x = Math.random() * size;
    let y = Math.random() * size;
    const segments: [number, number][][] = Array.from(
      { length: bus },
      () => [],
    );
    let horizontal = Math.random() > 0.5;
    const points: [number, number][] = [[x, y]];
    for (let s = 0; s < 2 + Math.floor(Math.random() * 3); s++) {
      const len = (30 + Math.random() * 160) * (Math.random() > 0.5 ? 1 : -1);
      if (horizontal) x += len;
      else y += len;
      points.push([x, y]);
      horizontal = !horizontal;
    }
    for (let b = 0; b < bus; b++) {
      segments[b] = points.map(([px, py]) => [px + b * 4, py + b * 4]);
    }
    const shade = Math.random();
    ctx.strokeStyle =
      shade < 0.7
        ? `rgba(28,62,94,${0.55 + Math.random() * 0.3})`
        : `rgba(54,98,138,${0.5 + Math.random() * 0.3})`;
    ctx.lineWidth = 1.4 + Math.random() * 1.4;
    for (const path of segments) {
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (const [px, py] of path.slice(1)) ctx.lineTo(px, py);
      ctx.stroke();
    }
  }

  // Vias e pads
  for (let i = 0; i < 600; i++) {
    const r = 1.5 + Math.random() * 2.5;
    const gold = Math.random() < 0.08;
    ctx.fillStyle = gold
      ? "rgba(170,140,70,0.8)"
      : `rgba(60,100,140,${0.5 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chips menores soldados na placa
  for (let i = 0; i < 26; i++) {
    const w = 24 + Math.random() * 70;
    const h = 24 + Math.random() * 70;
    const x = Math.random() * (size - w);
    const y = Math.random() * (size - h);
    ctx.fillStyle = "#060b14";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(70,100,140,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    // pinos
    ctx.fillStyle = "rgba(140,160,185,0.55)";
    for (let px = x + 4; px < x + w - 3; px += 6) {
      ctx.fillRect(px, y - 3, 2.5, 3);
      ctx.fillRect(px, y + h, 2.5, 3);
    }
  }

  pcbCache = finishTexture(canvas);
  return pcbCache;
}

let brushedNormalCache: THREE.Texture | null = null;

/**
 * Normal map procedural do metal escovado.
 * Canal R=X (127 neutro), G=Y perturbado pelas ranhuras horizontais, B=Z (255 sai da superfície).
 * Deve ser LinearSRGBColorSpace (não sRGB) para normal maps.
 */
export function brushedMetalNormalMap(): THREE.Texture {
  if (brushedNormalCache) return brushedNormalCache;
  const size = 512;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  // Base neutra: (127, 127, 255) = normal apontando diretamente para fora
  const imageData = ctx.createImageData(size, size);
  const d = imageData.data;
  for (let i = 0; i < size * size; i++) {
    d[i * 4] = 127;
    d[i * 4 + 1] = 127;
    d[i * 4 + 2] = 255;
    d[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  // Ranhuras horizontais: perturbam o canal G (Y), criando micro-relevo de escovado
  for (let i = 0; i < 2000; i++) {
    const y = Math.random() * size;
    const x = Math.random() * size - 100;
    const w = 60 + Math.random() * 280;
    const gShift = (Math.random() - 0.5) * 52;
    const g = Math.round(Math.max(85, Math.min(170, 127 + gShift)));
    ctx.strokeStyle = `rgba(127,${g},255,${0.22 + Math.random() * 0.52})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace; // normal map — nunca sRGB
  texture.anisotropy = 8;
  brushedNormalCache = texture;
  return texture;
}

let roughnessCache: THREE.Texture | null = null;

/**
 * Roughness map do metal escovado.
 * Grayscale: tiras horizontais com variação de brilho simulam
 * a anisotropia real do acabamento escovado (mais liso ao longo
 * das ranhuras, mais fosco no perpendicular).
 */
export function brushedMetalRoughnessMap(): THREE.Texture {
  if (roughnessCache) return roughnessCache;
  const size = 512;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#787878"; // 0.47 roughness base
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2400; i++) {
    const y = Math.random() * size;
    const x = Math.random() * size - 80;
    const w = 50 + Math.random() * 300;
    const v = Math.floor(55 + Math.random() * 115);
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.1 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace; // roughness map — nunca sRGB
  texture.anisotropy = 4;
  roughnessCache = texture;
  return texture;
}

let dieCache: THREE.Texture | null = null;

/**
 * Textura de die de silício — blocos funcionais, grade fina e
 * células brilhantes, como a fotografia macro de um processador.
 */
export function chipDieTexture() {
  if (dieCache) return dieCache;
  const size = 512;
  const canvas = makeCanvas(size);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0c1a2c";
  ctx.fillRect(0, 0, size, size);

  // Blocos funcionais (núcleos, cache, controladores)
  const palette = ["#10243c", "#0e2034", "#142b46", "#0d2741", "#16365a"];
  for (let i = 0; i < 130; i++) {
    const w = 16 + Math.random() * 90;
    const h = 16 + Math.random() * 90;
    ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
    ctx.fillRect(Math.random() * (size - w), Math.random() * (size - h), w, h);
  }

  // Grade fina de litografia
  ctx.strokeStyle = "rgba(90,160,220,0.07)";
  ctx.lineWidth = 1;
  for (let g = 0; g < size; g += 8) {
    ctx.beginPath();
    ctx.moveTo(g, 0);
    ctx.lineTo(g, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, g);
    ctx.lineTo(size, g);
    ctx.stroke();
  }

  // Células ativas brilhando
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(70,160,215,${0.25 + Math.random() * 0.45})`;
    ctx.fillRect(
      Math.random() * size,
      Math.random() * size,
      2 + Math.random() * 6,
      2 + Math.random() * 6,
    );
  }

  dieCache = finishTexture(canvas);
  return dieCache;
}
