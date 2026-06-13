"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Coleção", href: "#colecao" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "História", href: "#historia" },
  { label: "Ingredientes", href: "#ingredientes" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "glass border-b border-sand/40 py-3 shadow-soft"
            : "bg-transparent py-5"
        )}
      >
        <nav className="container-luxe flex items-center justify-between">
          <button
            className="lg:hidden -ml-2 p-2 text-espresso"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            aria-label="LUMIÈRE — Página inicial"
          >
            <span className="font-serif text-2xl font-light tracking-[0.35em] text-espresso">
              LUMIÈRE
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-underline text-xs font-medium uppercase tracking-luxe text-ink transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={openCart}
            className="relative -mr-2 p-2 text-espresso transition-colors hover:text-accent"
            aria-label={`Abrir carrinho, ${itemCount} artigos`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-cream-100"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-cream lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container-luxe flex items-center justify-between py-5">
              <span className="font-serif text-2xl font-light tracking-[0.35em] text-espresso">
                LUMIÈRE
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="-mr-2 p-2 text-espresso"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="container-luxe mt-10 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-sand/40 py-5 font-serif text-3xl font-light text-espresso"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
