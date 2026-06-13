"use client";

import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "./product-card";
import { products } from "@/lib/data";

export function BestSellers() {
  return (
    <section id="colecao" className="bg-cream-100 py-24 lg:py-32">
      <div className="container-luxe">
        <Reveal className="flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" />
              A Coleção
            </span>
            <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
              As nossas velas mais amadas.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Composições assinadas, produzidas artesanalmente em pequenos lotes
            com cera de soja e óleos essenciais selecionados.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
