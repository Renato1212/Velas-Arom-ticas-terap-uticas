"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cream py-24 lg:py-32">
      <div className="container-luxe grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Perguntas Frequentes
          </span>
          <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
            Tudo o que precisa de saber.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-soft">
            Não encontra a resposta que procura? A nossa equipa está disponível em{" "}
            <a
              href="mailto:ola@lumiere.eu"
              className="link-underline text-accent"
            >
              ola@lumiere.eu
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="divide-y divide-sand/50 border-t border-sand/50">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.question}>
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-serif text-xl text-espresso">
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand-dark/50 text-ink transition-all duration-500",
                          isOpen && "rotate-45 border-accent bg-accent text-cream-100"
                        )}
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-base leading-relaxed text-ink-soft">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
