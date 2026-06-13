"use client";

import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Histórias de Bem-Estar
            <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
            Quem vive o ritual, fala por nós.
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="font-medium text-espresso">4.9/5</span>
            <span className="text-sm text-ink-soft">
              · mais de 1.000 avaliações
            </span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.1}>
              <figure className="flex h-full flex-col rounded-2xl border border-sand/40 bg-cream-100 p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-premium">
                <Quote
                  className="h-8 w-8 text-accent/40"
                  strokeWidth={1.5}
                />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-sand/40 pt-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-dark/60 font-serif text-lg text-espresso">
                    {t.initials}
                  </span>
                  <div>
                    <p className="font-medium text-espresso">{t.name}</p>
                    <p className="text-xs text-ink-soft">
                      {t.flag} {t.country}
                    </p>
                  </div>
                  <div className="ml-auto flex text-accent">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
