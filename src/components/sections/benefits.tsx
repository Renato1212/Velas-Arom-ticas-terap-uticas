"use client";

import { Leaf, Moon, Target, Scale, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { benefits } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  moon: Moon,
  target: Target,
  scale: Scale,
};

export function Benefits() {
  return (
    <section id="beneficios" className="bg-cream py-24 lg:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Bem-estar Sensorial
            <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
            Criadas para os seus momentos mais importantes.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Cada fragrância foi composta para acompanhar um estado de espírito —
            transformando o ambiente num refúgio de calma e equilíbrio.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Reveal key={benefit.title} delay={i * 0.1}>
                <article className="group h-full rounded-2xl border border-sand/40 bg-cream-100 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-premium">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-cream-100">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-espresso">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {benefit.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
