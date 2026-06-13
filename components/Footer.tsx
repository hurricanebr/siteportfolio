import { footer, navLinks, site, whatsappLink } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-ink/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight text-frost">
            {site.name}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            {footer.tagline}
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-12 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-steel transition-colors duration-200 hover:text-frost"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-steel transition-colors duration-200 hover:text-frost"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${site.email}`}
            className="text-steel transition-colors duration-200 hover:text-frost"
          >
            {site.email}
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-steel/70">
        {footer.rights}
      </div>
    </footer>
  );
}
