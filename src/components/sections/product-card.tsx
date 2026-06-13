"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`Vela aromática ${product.name} — ${product.notes}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-cream-100/90 px-3 py-1 text-[10px] font-medium uppercase tracking-luxe text-espresso backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            wishlisted
              ? `Remover ${product.name} dos favoritos`
              : `Adicionar ${product.name} aos favoritos`
          }
          aria-pressed={wishlisted}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/90 text-ink backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:text-accent"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted && "fill-accent text-accent"
            )}
            strokeWidth={1.5}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            onClick={handleAdd}
            variant="light"
            size="default"
            className="w-full"
          >
            {added ? "Adicionado ✓" : "Adicionar Rápido"}
            {!added && <Plus className="h-4 w-4" strokeWidth={1.5} />}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-espresso">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-ink-soft">
            ({product.reviews})
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-luxe text-accent">
            {product.mood}
          </span>
        </div>

        <h3 className="mt-2 font-serif text-2xl leading-tight text-espresso">
          {product.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
          {product.notes}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-sand/40 pt-4">
          <div>
            <span className="font-serif text-2xl text-espresso">
              {formatPrice(product.price)}
            </span>
            <span className="ml-2 text-xs text-ink-soft">
              · {product.burnTime}
            </span>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={handleAdd} variant="primary" size="sm">
              {added ? "✓" : "Adicionar"}
            </Button>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
