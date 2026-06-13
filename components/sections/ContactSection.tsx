"use client";

import { ChevronDown, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact, site, whatsappLink } from "@/content/site";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-sm text-frost placeholder:text-steel/60 transition-colors duration-200 focus:border-volt/60 focus:outline-none";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    projectType: contact.projectTypes[0] as string,
    message: "",
  });

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Sem backend: o envio abre o WhatsApp com a mensagem preenchida.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Olá, Cássio! Meu nome é ${form.name}.`,
      `Tipo de projeto: ${form.projectType}`,
      `WhatsApp: ${form.whatsapp}`,
      `E-mail: ${form.email}`,
      "",
      form.message,
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contato" className="relative py-28" aria-label="Contato">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={contact.eyebrow}
              title={contact.title}
              subtitle={contact.subtitle}
            />

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-4">
                <a
                  href={whatsappLink(
                    "Olá, Cássio! Vi seu site e quero conversar sobre um projeto.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-fit cursor-pointer items-center gap-2.5 rounded-full bg-[#1e9e54] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(37,211,102,0.25)] transition-colors duration-200 hover:bg-[#23b561]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {contact.whatsappLabel}
                </a>
                <p className="flex items-center gap-2 text-sm text-steel">
                  <Mail className="h-4 w-4 text-volt" aria-hidden="true" />
                  {contact.emailNote}{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="cursor-pointer text-silver underline decoration-volt/40 underline-offset-4 transition-colors duration-200 hover:text-frost"
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <GlassCard padding="p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-medium text-silver"
                    >
                      Nome
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Seu nome"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-whatsapp"
                      className="mb-1.5 block text-sm font-medium text-silver"
                    >
                      WhatsApp
                    </label>
                    <input
                      id="contact-whatsapp"
                      type="tel"
                      autoComplete="tel"
                      value={form.whatsapp}
                      onChange={update("whatsapp")}
                      placeholder="(00) 00000-0000"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium text-silver"
                  >
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="voce@exemplo.com"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-type"
                    className="mb-1.5 block text-sm font-medium text-silver"
                  >
                    Tipo de projeto
                  </label>
                  <div className="relative">
                    <select
                      id="contact-type"
                      value={form.projectType}
                      onChange={update("projectType")}
                      className={`${inputClasses} cursor-pointer appearance-none pr-10`}
                    >
                      {contact.projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-ink">
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-silver"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Conte rapidamente o que você precisa"
                    className={`${inputClasses} resize-y`}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-azure to-[#1ea8d8] px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:from-[#3f7bff] hover:to-[#27bdef]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {contact.submitLabel}
                </button>
                <p className="text-xs leading-relaxed text-steel/70">
                  O envio abre o seu WhatsApp com a mensagem preenchida — sem
                  cadastro e sem intermediários.
                </p>
              </form>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
