/**
 * Estado compartilhado da jornada de scroll (hero → galáxia).
 * Mantido fora do React para que a cena 3D leia os valores a cada
 * frame sem provocar re-renderizações.
 */
export const journeyState = {
  /** Progresso bruto do scroll dentro de #journey (0 a 1). */
  progress: 0,
  /** Progresso suavizado (atualizado pelo CameraRig). */
  smoothProgress: 0,
  /** Posição do ponteiro normalizada (-1 a 1). */
  pointerX: 0,
  pointerY: 0,
  bounds: { top: 0, height: 1 },
};

export function measureJourney() {
  const el = document.getElementById("journey");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  journeyState.bounds.top = rect.top + window.scrollY;
  journeyState.bounds.height = rect.height;
}

/** Lê o progresso atual do scroll dentro da jornada, já limitado a [0, 1]. */
export function readJourneyProgress() {
  const { top, height } = journeyState.bounds;
  const span = height - window.innerHeight;
  if (span <= 0) return 0;
  const p = (window.scrollY - top) / span;
  return Math.min(1, Math.max(0, p));
}
