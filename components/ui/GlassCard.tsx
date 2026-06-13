import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  /** Classe de padding (sobrescreve o padrão p-6). */
  padding?: string;
  /** Realce de borda/glow no hover (para cards interativos). */
  interactive?: boolean;
};

export function GlassCard({
  children,
  className = "",
  padding = "p-6",
  interactive = false,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/8 bg-white/[0.035] ${padding} backdrop-blur-md ${
        interactive
          ? "cursor-default transition-colors duration-200 hover:border-volt/35 hover:bg-white/[0.06]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
