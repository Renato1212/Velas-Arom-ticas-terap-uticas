"use client";

import {
  Flame,
  Droplet,
  Sprout,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ingredients } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  droplet: Droplet,
  sprout: Sprout,
  sparkles: Sparkles,
};

export function Ingredients() {
  return (
    <section
      id="ingredientes"
      className="relative overflow-hidden bg-espresso py-24 text-cream-100 lg:py-32"
    >
      <div className="absolute inset-0 bg-grain opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-sand">
            <span className="h-px w-8 bg-sand" />
            A Composição
            <span className="h-px w-8 bg-sand" />
          </span>
          <h2 className="heading-display mt-6 text-4xl text-cream-100 sm:text-5xl text-balance">
            Ingredientes nobres, escolhidos com rigor.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream-200/80">
            Apenas o essencial, na sua forma mais pura. Cada componente é
            selecionado pela qualidade, pela origem e pelo respeito pela natureza.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-cream-200/10 bg-cream-200/10 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((ingredient, i) => {
            const Icon = iconMap[ingredient.icon];
            return (
              <Reveal key={ingredient.title} delay={i * 0.1}>
                <div className="group h-full bg-espresso p-8 transition-colors duration-500 hover:bg-espresso-light">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-sand/30 text-sand transition-all duration-500 group-hover:border-sand group-hover:bg-sand group-hover:text-espresso">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl text-cream-100">
                    {ingredient.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-200/70">
                    {ingredient.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
