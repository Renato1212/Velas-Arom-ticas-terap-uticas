# LUMIÈRE — Velas Aromáticas Premium

> Mais que um aroma. Bem-estar que se sente.

Landing page premium para uma marca europeia de velas aromáticas de luxo,
inspirada em casas como Diptyque, Jo Malone London, Aesop, Rituals e Le Labo.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** + sistema de design personalizado
- **Framer Motion** (animações suaves e luxuosas)
- **lucide-react** (ícones premium)
- Componentes UI no estilo **shadcn/ui**

## Começar

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de produção
npm run start   # servir build de produção
```

## Estrutura

```
src/
├── app/
│   ├── layout.tsx          # Metadata, fontes, SEO, structured data
│   ├── page.tsx            # Composição da landing page
│   ├── globals.css         # Sistema de design (tokens, utilitários)
│   ├── robots.ts / sitemap.ts
├── components/
│   ├── cart/               # Cart context + drawer (com wishlist)
│   ├── layout/             # Navbar sticky, footer, sticky CTA mobile
│   ├── sections/           # Hero, Benefícios, Coleção, História, etc.
│   └── ui/                 # Button, Reveal (primitivas reutilizáveis)
└── lib/
    ├── data.ts             # Produtos, testemunhos, FAQs (mock data)
    ├── structured-data.ts  # JSON-LD: Organization, Product, FAQ
    └── utils.ts            # cn(), formatPrice()
```

## Características

- Design system luxuoso (paleta quente, Cormorant Garamond + Inter)
- Navegação sticky + CTA sticky em mobile
- Cart drawer com barra de progresso de envio gratuito
- Wishlist e quick add to cart
- Animações de scroll, micro-interações, smooth scroll
- Totalmente responsivo, mobile-first e acessível
- SEO completo: meta tags, Open Graph, structured data (Product + FAQ schema)
- Conformidade com linguagem europeia (sem alegações médicas)

## Conformidade

A comunicação usa linguagem de bem-estar sensorial (relaxamento, atmosfera,
ritual, foco, equilíbrio) e **não** faz alegações médicas ou terapêuticas de
tratamento de doenças, em conformidade com a regulamentação europeia.
