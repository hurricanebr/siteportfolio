# Datacenter Stage — Design

**Data:** 2026-06-16
**Status:** Aprovado

## Problema

O primeiro visual da jornada 3D (estágio inicial, progress ≈ 0) é o `ComputerCase`,
que carrega um modelo `office_pc.glb` via `GLTFLoader`. Isso adiciona uma requisição
de rede e latência no primeiro acesso ao site, além de não estar agradando
visualmente. O objetivo é substituir o gabinete por um **datacenter abstrato** que
carregue instantaneamente (sem nenhum asset de rede).

## Solução

Novo estágio `DatacenterStage`, 100% procedural (Three.js puro), substituindo
`ComputerCase` como primeiro estágio da jornada. Zero requisição de rede — a
geometria é gerada em memória no mesmo frame em que o canvas abre.

### Decisões de design (validadas com o usuário)

- **Estilo:** minimalista — racks em wireframe com partículas de dados fluindo
  entre eles (estilo abstrato, coerente com `Motherboard`/`ChipCity`/`Galaxy`).
- **Densidade:** 2–3 racks, câmera próxima.
- **Paleta:** verde neon matrix (`#00ff88`) para wireframe, LEDs e partículas.
- **Partículas:** fluxo vertical — sobem/descem ao longo da altura dos racks,
  simulando processamento interno.

## Arquitetura

### Arquivo novo
`components/three/stages/DatacenterStage.tsx`

Segue o padrão exato dos estágios existentes:
- Recebe `{ quality: "high" | "low" }`.
- Constrói geometria/materiais memoizados em `useMemo`, recriados quando `quality` muda.
- Lê `journeyState.smoothProgress` no `useFrame`.
- Aplica `stageFade(p, -1, 0, 0.18, 0.3)` — **mesmos parâmetros** do `ComputerCase`
  atual, preservando a transição de scroll para o próximo estágio (`Motherboard`).
- Limpa geometrias/materiais no return do `useEffect`/unmount.

### Arquivo modificado
`components/three/JourneyCanvas.tsx`
- Remove `import { ComputerCase }` e `<ComputerCase quality={quality} />`.
- Adiciona `import { DatacenterStage }` e `<DatacenterStage quality={quality} />`.
- Nada mais muda: `CameraRig`, `SceneEnvironment`, luzes e posição de câmera
  permanecem idênticos. A câmera em `p=0` está em `[1.1, 0.65, 5.2]` olhando para
  `[-0.85, 0.05, 0]`, então o datacenter é centrado próximo à origem.

## Estrutura visual

### Racks (3 unidades)
- Cada rack: `BoxGeometry` (~2.2 alt × 0.9 larg × 0.7 prof) renderizado como
  **wireframe** via `EdgesGeometry` + `LineSegments`, cor `#00ff88`.
- Dispostos lado a lado com leve espaçamento e leve rotação para dar profundidade.
- Centrados próximo à origem para ficarem no enquadramento inicial da câmera.

### Slots de servidores
- Cada rack subdividido em ~12 slots horizontais (linhas/finos boxes em wireframe),
  dando a leitura de "servidores empilhados".

### LEDs de status
- `Points` com `softCircleTexture()` + `AdditiveBlending`, cor verde, posicionados
  na face frontal de cada slot.
- Pulso/piscar sutil via `useFrame` com offset determinístico (`seededRandom`).

### Partículas de dados (fluxo vertical)
- `Points` com `DynamicDrawUsage`, partículas distribuídas dentro/ao redor dos racks.
- No `useFrame`, sobem ao longo de Y; ao passar o topo, reiniciam na base
  (mesmo padrão das "fagulhas" do `ChipCity`).
- Cor verde, `AdditiveBlending`, `depthWrite: false`.

### Brilho de chão
- Plano com `MeshBasicMaterial` aditivo abaixo dos racks (reaproveita
  `softCircleTexture()`), em verde, opacidade controlada pelo fade — herdado do
  padrão do `ComputerCase`.

## Materiais / reuso
- `softCircleTexture()` de `components/three/textures.ts` para LEDs, partículas e chão.
- `seededRandom`, `stageFade`, `range` de `lib/math.ts`.
- Sem PBR pesado, sem texturas de rede — apenas wireframe + glow aditivo.

## Animação / fade
- `fade = stageFade(p, -1, 0, 0.18, 0.3)`.
- `group.visible = fade > 0.01` (early-out quando invisível).
- Todos os materiais transparentes têm `opacity` multiplicada por `fade`.
- LEDs pulsam; partículas sobem continuamente; leve rotação opcional do grupo.

## Performance
- `high`: ~3 racks, ~400 partículas, ~36 LEDs.
- `low` (mobile, < 768px): contagens reduzidas (~150 partículas).
- Geometria gerada uma vez, sem reflow; animação só altera atributos/opacidade.

## Fora de escopo (YAGNI)
- Texto/labels nos racks.
- Cabos detalhados entre racks.
- Modelo GLB de qualquer tipo.
- Mudanças no `CameraRig` ou nas luzes da cena.
