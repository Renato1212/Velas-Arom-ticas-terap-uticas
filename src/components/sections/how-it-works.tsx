"use client";

import { Reveal } from "@/components/ui/reveal";
import { steps } from "@/lib/data";

export function HowItWorks() {
  return (
    <section className="bg-cream-100 py-24 lg:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            O Ritual
            <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
            Três gestos para transformar o seu espaço.
          </h2>
        </Reveal>

        <div className="relative mt-20">
          {/* Connecting line */}
          <div
            className="absolute left-0 top-10 hidden h-px w-full bg-gradient-to-r from-transparent via-sand-dark/60 to-transparent lg:block"
            aria-hidden="true"
          />

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 0.15}>
                <div className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-cream font-serif text-2xl text-accent shadow-soft">
                    {step.number}
                  </span>
                  <h3 className="mt-7 font-serif text-2xl text-espresso">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
