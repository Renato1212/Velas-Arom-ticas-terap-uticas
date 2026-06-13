"use client";

import { useState } from "react";
import { Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerNav = [
  {
    title: "Maison",
    links: [
      { label: "Sobre Nós", href: "#historia" },
      { label: "A Coleção", href: "#colecao" },
      { label: "Ingredientes", href: "#ingredientes" },
      { label: "Sustentabilidade", href: "#ingredientes" },
    ],
  },
  {
    title: "Apoio",
    links: [
      { label: "Contacto", href: "mailto:ola@lumiere.eu" },
      { label: "Envios & Entregas", href: "#faq" },
      { label: "Devoluções", href: "#faq" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Termos & Condições", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Conformidade UE", href: "#" },
    ],
  },
];

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.5 2 3.5 5.72 3.5 9.66c0 1.83 1.04 4.1 2.7 4.83.25.11.39.06.45-.18.04-.18.27-1.1.37-1.52a.4.4 0 0 0-.09-.38c-.55-.67-1-1.9-1-3.05 0-2.95 2.23-5.8 6.04-5.8 3.29 0 5.59 2.24 5.59 5.45 0 3.63-1.83 6.14-4.22 6.14-1.32 0-2.3-1.09-1.99-2.43.38-1.6 1.11-3.32 1.11-4.47 0-1.03-.55-1.89-1.7-1.89-1.35 0-2.43 1.4-2.43 3.27 0 1.19.4 2 .4 2s-1.36 5.76-1.6 6.78c-.27 1.13-.04 2.51-.02 2.65.01.08.11.1.16.04.07-.09 1-1.24 1.31-2.38.09-.32.51-2 .51-2 .25.48 1 .9 1.79.9 2.36 0 3.96-2.15 3.96-5.03C20.5 5.6 17.66 2 12.04 2z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <footer className="bg-espresso text-cream-200">
      <div className="container-luxe py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <span className="font-serif text-3xl font-light tracking-[0.3em] text-cream-100">
              LUMIÈRE
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-200/70">
              Velas aromáticas premium para transformar momentos comuns em
              rituais de bem-estar. Feitas na Europa, com cera de soja e óleos
              essenciais.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-sm">
              <label
                htmlFor="newsletter"
                className="text-xs font-medium uppercase tracking-luxe text-sand"
              >
                Newsletter
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O seu email"
                  className="h-12 w-full rounded-md border border-cream-200/20 bg-espresso-light px-4 text-sm text-cream-100 placeholder:text-cream-200/40 focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/40"
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="icon"
                  aria-label="Subscrever newsletter"
                >
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>
              {submitted && (
                <p className="mt-3 text-xs text-sand">
                  ✓ Obrigado. Bem-vindo ao universo LUMIÈRE.
                </p>
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-cream-200/50">
                Ao subscrever, aceita receber comunicações da LUMIÈRE. Pode
                cancelar a qualquer momento.
              </p>
            </form>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-medium uppercase tracking-luxe text-sand">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="link-underline text-sm text-cream-200/70 transition-colors hover:text-cream-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-cream-200/10 pt-8 sm:flex-row">
          <p className="text-xs text-cream-200/50">
            © {new Date().getFullYear()} LUMIÈRE. Todos os direitos reservados.
            Feito na Europa.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-200/20 text-cream-200/70 transition-all hover:border-sand hover:text-cream-100"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-200/20 text-cream-200/70 transition-all hover:border-sand hover:text-cream-100"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
