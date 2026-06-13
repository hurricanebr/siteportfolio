"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion, useWebGLSupport } from "@/lib/hooks";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas"), {
  ssr: false,
});

/**
 * Fundo fixo da página inteira.
 * - Com WebGL: jornada 3D controlada pelo scroll.
 * - Sem WebGL (ou com prefers-reduced-motion): fallback com
 *   gradientes profundos que mantém a estética premium.
 */
export function ScrollScene() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const show3D = webgl === true && !reduced;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Base sempre presente — também serve de fallback */}
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 700px at 75% -10%, rgba(46,111,255,0.14), transparent 70%)," +
            "radial-gradient(900px 600px at 15% 110%, rgba(60,224,255,0.08), transparent 70%)",
        }}
      />
      {!show3D && (
        <div
          className="bg-drift absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(700px 480px at 50% 42%, rgba(46,111,255,0.16), transparent 70%)," +
              "radial-gradient(420px 300px at 62% 38%, rgba(60,224,255,0.12), transparent 70%)," +
              "radial-gradient(300px 220px at 40% 55%, rgba(216,180,90,0.05), transparent 70%)",
          }}
        />
      )}

      {show3D && (
        <div className="absolute inset-0">
          <JourneyCanvas />
        </div>
      )}

      {/* Vinheta para legibilidade do conteúdo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(2,4,10,0.5) 100%)",
        }}
      />
    </div>
  );
}
