"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/40 glass p-4 lg:hidden"
        >
          <button
            onClick={() =>
              document
                .getElementById("colecao")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-espresso text-xs font-medium uppercase tracking-luxe text-cream-100"
          >
            Descobrir Coleção
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
