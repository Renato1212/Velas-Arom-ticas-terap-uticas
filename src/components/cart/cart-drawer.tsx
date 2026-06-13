"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 60;

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    itemCount,
    removeItem,
    updateQuantity,
  } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream-100 shadow-premium"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
          >
            <header className="flex items-center justify-between border-b border-sand/50 px-6 py-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-accent" strokeWidth={1.5} />
                <h2 className="font-serif text-2xl text-espresso">
                  O seu carrinho
                </h2>
                <span className="text-sm text-ink-soft">({itemCount})</span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="rounded-full p-2 text-ink transition-colors hover:bg-sand/40"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag
                  className="h-12 w-12 text-sand-dark"
                  strokeWidth={1}
                />
                <p className="font-serif text-2xl text-espresso">
                  O seu carrinho está vazio
                </p>
                <p className="max-w-xs text-sm text-ink-soft">
                  Descubra a nossa coleção de velas aromáticas premium e comece o
                  seu ritual.
                </p>
                <Button onClick={closeCart} variant="primary" className="mt-2">
                  Descobrir Coleção
                </Button>
              </div>
            ) : (
              <>
                <div className="border-b border-sand/50 px-6 py-4">
                  {remaining > 0 ? (
                    <p className="text-xs text-ink-soft">
                      Faltam{" "}
                      <span className="font-medium text-accent">
                        {formatPrice(remaining)}
                      </span>{" "}
                      para envio gratuito
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-accent">
                      ✓ Tem direito a envio gratuito
                    </p>
                  )}
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand/50">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-sand/40 overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-sand/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-lg leading-tight text-espresso">
                              {item.product.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {item.product.notes}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Remover ${item.product.name}`}
                            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-sand/40 hover:text-espresso"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-sand-dark/50">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              aria-label="Diminuir quantidade"
                              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:text-accent disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              aria-label="Aumentar quantidade"
                              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:text-accent"
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <span className="font-medium text-espresso">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-sand/50 bg-cream px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-luxe text-ink-soft">
                      Subtotal
                    </span>
                    <span className="font-serif text-2xl text-espresso">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    Impostos e portes calculados no checkout.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="mt-4 w-full"
                    onClick={closeCart}
                  >
                    Finalizar Compra
                  </Button>
                  <button
                    onClick={closeCart}
                    className="mt-3 w-full text-center text-xs uppercase tracking-luxe text-ink-soft transition-colors hover:text-accent"
                  >
                    Continuar a comprar
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
