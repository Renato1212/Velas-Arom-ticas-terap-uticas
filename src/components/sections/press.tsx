"use client";

import { Reveal } from "@/components/ui/reveal";
import { pressLogos } from "@/lib/data";

export function Press() {
  return (
    <section
      aria-label="Imprensa e reconhecimento"
      className="border-y border-sand/40 bg-cream-100 py-16"
    >
      <div className="container-luxe">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-luxe text-ink-soft">
            Reconhecida por quem valoriza o bem-estar.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-16">
            {pressLogos.map((logo) => (
              <li
                key={logo}
                className="font-serif text-xl tracking-[0.2em] text-ink-soft/60 transition-colors duration-300 hover:text-espresso lg:text-2xl"
              >
                {logo}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
