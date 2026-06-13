"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape fecha o menu mobile
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-5 py-3 transition-colors duration-300 ${
          scrolled || open
            ? "border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#inicio"
          className="flex items-center gap-3 text-sm font-semibold text-frost"
          aria-label={`${site.name} — voltar ao início`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-volt/30 bg-volt/10 font-display text-xs font-bold tracking-wider text-volt">
            {site.initials}
          </span>
          <span className="hidden font-display tracking-tight sm:block">
            {site.shortName}
          </span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-steel transition-colors duration-200 hover:text-frost"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contato"
            className="hidden min-h-10 cursor-pointer items-center rounded-full bg-gradient-to-r from-azure to-[#1ea8d8] px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:from-[#3f7bff] hover:to-[#27bdef] lg:inline-flex"
          >
            Falar comigo
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-frost transition-colors hover:border-volt/40 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal (mobile)"
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm text-frost transition-colors hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contato"
                className="mt-2 block rounded-xl bg-gradient-to-r from-azure to-[#1ea8d8] px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Falar comigo
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
