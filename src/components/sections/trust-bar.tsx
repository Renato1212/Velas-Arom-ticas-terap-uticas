"use client";

import { Check } from "lucide-react";
import { trustItems } from "@/lib/data";

export function TrustBar() {
  return (
    <section
      aria-label="Garantias de qualidade"
      className="border-y border-sand/40 bg-espresso text-cream-100"
    >
      <div className="container-luxe overflow-hidden py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:gap-x-12">
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-xs uppercase tracking-luxe text-cream-200/90"
            >
              <Check className="h-4 w-4 text-sand" strokeWidth={2} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
