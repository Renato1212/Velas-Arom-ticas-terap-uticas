"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const stats = [
  { value: "100%", label: "Cera de soja natural" },
  { value: "8", label: "Países europeus" },
  { value: "50h+", label: "De queima limpa" },
];

export function Story() {
  const reduce = useReducedMotion();

  return (
    <section id="historia" className="bg-cream py-24 lg:py-32">
      <div className="container-luxe grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-premium">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1599751449628-8e3a1f1f1f1f?auto=format&fit=crop&w=1000&q=80"
              alt="Ambiente sereno com velas LUMIÈRE num espaço de inspiração europeia"
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1000&q=80";
              }}
            />
          </div>
          <div className="absolute -right-5 -top-5 hidden rounded-2xl bg-espresso px-7 py-6 text-cream-100 shadow-premium sm:block">
            <p className="font-serif text-3xl">LUMIÈRE</p>
            <p className="text-[10px] uppercase tracking-luxe text-cream-200/80">
              Maison de Bem-Estar
            </p>
          </div>
        </motion.div>

        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" />
              A Nossa História
            </span>
            <h2 className="heading-display mt-6 text-4xl sm:text-5xl text-balance">
              Uma nova forma de viver o bem-estar.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                A LUMIÈRE nasceu da convicção de que o bem-estar começa nos
                detalhes. Inspirados nas tradições da alta perfumaria europeia e
                nos rituais sensoriais dos melhores spas e hotéis, criámos velas
                que são, antes de tudo, uma experiência.
              </p>
              <p>
                Cada peça é produzida artesanalmente em pequenos lotes, com cera
                de soja sustentável e óleos essenciais cuidadosamente
                selecionados. As composições são assinadas por mestres
                perfumistas, equilibrando sofisticação e a calma de um momento só
                seu.
              </p>
              <p>
                Acreditamos no luxo discreto — aquele que não se impõe, mas se
                sente. Em cada chama, um convite a abrandar.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-sand/50 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-3xl text-accent">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
