import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "whatsapp";
  className?: string;
  external?: boolean;
};

const base =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-colors duration-200";

const variants = {
  primary:
    "bg-gradient-to-r from-azure to-[#1ea8d8] text-white shadow-[0_0_28px_rgba(46,111,255,0.35)] hover:from-[#3f7bff] hover:to-[#27bdef]",
  ghost:
    "border border-white/15 bg-white/[0.03] text-frost hover:border-volt/50 hover:text-white",
  whatsapp:
    "bg-[#1e9e54] text-white shadow-[0_0_24px_rgba(37,211,102,0.25)] hover:bg-[#23b561]",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
