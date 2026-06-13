"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-espresso py-28 text-cream-100 lg:py-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-espresso/80 via-espresso/70 to-espresso/90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl animate-flicker"
        aria-hidden="true"
      />

      <div className="container-luxe relative text-center">
        <motion.span
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="eyebrow justify-center text-sand"
        >
          <span className="h-px w-8 bg-sand" />
          O seu ritual começa aqui
          <span className="h-px w-8 bg-sand" />
        </motion.span>

        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="heading-display mx-auto mt-7 max-w-3xl text-5xl text-cream-100 sm:text-6xl lg:text-7xl text-balance"
        >
          Transforme os seus momentos em rituais.
        </motion.h2>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-200/80"
        >
          Descubra a coleção que está a redefinir o bem-estar sensorial na
          Europa. Envio gratuito em encomendas acima de €60.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10"
        >
          <Button
            size="lg"
            variant="light"
            onClick={() =>
              document
                .getElementById("colecao")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Descobrir Coleção
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
