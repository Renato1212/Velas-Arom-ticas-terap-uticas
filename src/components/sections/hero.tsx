"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden gradient-warm pt-28 lg:pt-0"
    >
      <div className="absolute inset-0 bg-grain opacity-60" aria-hidden="true" />

      {/* Floating ambient orbs */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-sand/40 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl animate-float"
        aria-hidden="true"
      />

      <div className="container-luxe relative grid min-h-screen items-center gap-12 py-20 lg:grid-cols-2 lg:gap-8">
        {/* Left — copy */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" />
              Aromaterapia de Luxo · Europa
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display mt-6 text-5xl sm:text-6xl lg:text-7xl text-balance"
          >
            Mais que um aroma.{" "}
            <span className="italic text-accent">Bem-estar</span> que se sente.
          </motion.h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft"
          >
            Velas aromáticas premium desenvolvidas para transformar momentos
            comuns em rituais de bem-estar.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={() =>
                document
                  .getElementById("colecao")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Descobrir Coleção
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("historia")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Conhecer a História
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["S", "L", "E", "M"].map((c, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream bg-sand-dark/70 font-serif text-sm text-espresso"
                >
                  {c}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1 text-sm font-medium text-espresso">
                  4.9/5
                </span>
              </div>
              <p className="text-xs text-ink-soft">
                + 1.200 rituais criados por toda a Europa
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right — candle image */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-b from-sand/60 to-accent/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-premium">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80"
                alt="Vela aromática premium LUMIÈRE com chama suave"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent"
                aria-hidden="true"
              />
              {/* Flicker glow */}
              <div
                className="absolute left-1/2 top-[18%] h-24 w-24 -translate-x-1/2 rounded-full bg-amber-100/40 blur-2xl animate-flicker"
                aria-hidden="true"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute -bottom-6 -left-6 rounded-xl bg-cream-100/90 px-5 py-4 shadow-premium backdrop-blur-sm"
            >
              <p className="font-serif text-lg text-espresso">100% Cera de Soja</p>
              <p className="text-xs uppercase tracking-luxe text-ink-soft">
                Queima limpa · 50h+
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
