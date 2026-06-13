import { products, faqs } from "./data";

const SITE_URL = "https://lumiere.eu";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LUMIÈRE",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Velas aromáticas premium desenvolvidas para criar momentos de bem-estar através de fragrâncias sofisticadas inspiradas na aromaterapia.",
  slogan: "Mais que um aroma. Bem-estar que se sente.",
  sameAs: ["https://instagram.com/lumiere", "https://pinterest.com/lumiere"],
  areaServed: ["PT", "ES", "FR", "DE", "NL", "IT", "BE", "CH"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LUMIÈRE",
  url: SITE_URL,
  inLanguage: "pt-PT",
};

export const productsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Coleção de Velas Aromáticas LUMIÈRE",
  itemListElement: products.map((product, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      brand: { "@type": "Brand", name: "LUMIÈRE" },
      category: "Velas Aromáticas",
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/#colecao`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews,
        bestRating: 5,
        worstRating: 1,
      },
    },
  })),
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
