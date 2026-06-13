export type Product = {
  id: string;
  name: string;
  notes: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  burnTime: string;
  image: string;
  badge?: string;
  mood: string;
};

export const products: Product[] = [
  {
    id: "calma-equilibrio",
    name: "Calma & Equilíbrio",
    notes: "Lavanda · Camomila · Sálvia",
    description:
      "Uma composição serena que envolve o espaço numa atmosfera de descanso profundo e clareza mental.",
    price: 39,
    rating: 4.9,
    reviews: 312,
    burnTime: "50h",
    mood: "Relaxamento",
    badge: "Mais vendida",
    image:
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "serenidade",
    name: "Serenidade",
    notes: "Baunilha · Sândalo",
    description:
      "O conforto quente da baunilha encontra a profundidade amadeirada do sândalo, para momentos de aconchego.",
    price: 42,
    rating: 4.8,
    reviews: 248,
    burnTime: "55h",
    mood: "Conforto",
    image:
      "https://images.unsplash.com/photo-1608181831718-c9ffd8728e6c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "aurora",
    name: "Aurora",
    notes: "Bergamota · Chá Branco",
    description:
      "Uma abertura luminosa e cítrica que desperta os sentidos e ilumina as manhãs com frescura elegante.",
    price: 45,
    rating: 5.0,
    reviews: 197,
    burnTime: "55h",
    mood: "Foco",
    badge: "Nova",
    image:
      "https://images.unsplash.com/photo-1596433809252-c0a8a8b4f5b9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "noite-profunda",
    name: "Noite Profunda",
    notes: "Cedro · Patchouli",
    description:
      "Notas terrosas e envolventes que preparam o corpo e a mente para o repouso ao fim do dia.",
    price: 48,
    rating: 4.9,
    reviews: 164,
    burnTime: "60h",
    mood: "Sono",
    image:
      "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?auto=format&fit=crop&w=900&q=80",
  },
];

export type Testimonial = {
  name: string;
  country: string;
  flag: string;
  rating: number;
  quote: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sofia Almeida",
    country: "Lisboa, Portugal",
    flag: "🇵🇹",
    rating: 5,
    initials: "SA",
    quote:
      "A vela Calma & Equilíbrio tornou-se parte do meu ritual de fim de tarde. A fragrância é subtil, elegante e nunca enjoa. Um verdadeiro objeto de luxo.",
  },
  {
    name: "Lucas Moreau",
    country: "Paris, France",
    flag: "🇫🇷",
    rating: 5,
    initials: "LM",
    quote:
      "Comparável às melhores casas de perfumaria que conheço. A qualidade da cera e a difusão do aroma são impecáveis. Acendo Serenidade todas as noites.",
  },
  {
    name: "Elena Conti",
    country: "Milano, Italia",
    flag: "🇮🇹",
    rating: 5,
    initials: "EC",
    quote:
      "O packaging é digno de presente, mas o que me conquistou foi a experiência sensorial. Aurora transformou o meu escritório num espaço de foco e calma.",
  },
  {
    name: "Maximilian Vogel",
    country: "München, Deutschland",
    flag: "🇩🇪",
    rating: 5,
    initials: "MV",
    quote:
      "Produção artesanal que se nota em cada detalhe. A queima é limpa e uniforme, sem fumo. Exatamente o que esperava de uma marca premium europeia.",
  },
  {
    name: "Margot Janssen",
    country: "Amsterdam, Nederland",
    flag: "🇳🇱",
    rating: 5,
    initials: "MJ",
    quote:
      "Noite Profunda acompanha o meu ritual de descanso. A atmosfera que cria é incomparável — sinto-me num spa de hotel de luxo em casa.",
  },
  {
    name: "Isabel Fernández",
    country: "Madrid, España",
    flag: "🇪🇸",
    rating: 5,
    initials: "IF",
    quote:
      "Ingredientes naturais, cera de soja e óleos essenciais de verdade. Nota-se a diferença face às velas comuns. Já é a minha terceira encomenda.",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Quanto tempo dura uma vela LUMIÈRE?",
    answer:
      "Cada vela oferece entre 50 a 60 horas de queima, dependendo da composição. Para uma duração ótima, recomendamos acender por períodos de 2 a 3 horas, aparando o pavio a cada utilização.",
  },
  {
    question: "Fazem envios para toda a Europa?",
    answer:
      "Sim. Enviamos para Portugal, Espanha, França, Alemanha, Países Baixos, Itália, Bélgica e Suíça. O envio é gratuito em encomendas acima de €60 e os prazos variam entre 2 a 5 dias úteis.",
  },
  {
    question: "As velas são veganas?",
    answer:
      "Todas as nossas velas são 100% veganas e cruelty-free. Utilizamos cera de soja natural, óleos essenciais e pavios de algodão, sem qualquer ingrediente de origem animal.",
  },
  {
    question: "De que são feitas as velas?",
    answer:
      "Cada vela é produzida artesanalmente com cera de soja sustentável, pavio de algodão sem chumbo e uma mistura cuidada de óleos essenciais e fragrâncias premium, livres de parafina e parabenos.",
  },
  {
    question: "As fragrâncias têm benefícios terapêuticos?",
    answer:
      "As nossas composições são inspiradas em tradições de aromaterapia para criar atmosferas de relaxamento, foco e equilíbrio. São pensadas para o bem-estar sensorial e não substituem qualquer aconselhamento médico.",
  },
  {
    question: "Como cuidar da minha vela para uma queima perfeita?",
    answer:
      "Na primeira utilização, deixe a cera derreter até às bordas para evitar túneis. Apare o pavio a cerca de 5 mm antes de cada queima e mantenha a vela afastada de correntes de ar.",
  },
  {
    question: "A embalagem é sustentável?",
    answer:
      "Sim. Utilizamos recipientes de vidro reutilizáveis e embalagens em cartão reciclado e reciclável, com tintas de base vegetal. Privilegiamos sempre materiais responsáveis.",
  },
  {
    question: "Posso oferecer como presente?",
    answer:
      "Com certeza. Cada vela é apresentada numa embalagem elegante, ideal para oferta. No checkout pode adicionar uma mensagem personalizada e optar por embrulho premium.",
  },
  {
    question: "Qual é a política de devoluções?",
    answer:
      "Dispõe de 30 dias para devolver produtos não utilizados na embalagem original. O reembolso é processado em até 14 dias após a receção da devolução, conforme a legislação europeia.",
  },
  {
    question: "As velas libertam fumo ou fuligem?",
    answer:
      "A cera de soja e o pavio de algodão garantem uma queima limpa e uniforme, com produção mínima de fuligem. Aparar o pavio regularmente assegura a experiência mais pura.",
  },
];

export const benefits = [
  {
    title: "Relaxamento",
    description:
      "Composições serenas que envolvem o ambiente numa atmosfera de calma, ideais para libertar a tensão do dia.",
    icon: "leaf",
  },
  {
    title: "Sono",
    description:
      "Aromas suaves e amadeirados que acompanham o seu ritual de fim de dia, preparando o espaço para o descanso.",
    icon: "moon",
  },
  {
    title: "Foco",
    description:
      "Notas frescas e luminosas que despertam os sentidos e ajudam a criar um ambiente de concentração e clareza.",
    icon: "target",
  },
  {
    title: "Equilíbrio",
    description:
      "Fragrâncias equilibradas para momentos de mindfulness, devolvendo serenidade ao corpo e à mente.",
    icon: "scale",
  },
] as const;

export const ingredients = [
  {
    title: "Cera de Soja",
    description:
      "Renovável e de origem vegetal, garante uma queima lenta, limpa e uniforme, sem parafina.",
    icon: "flame",
  },
  {
    title: "Óleos Essenciais",
    description:
      "Selecionados de fontes naturais, conferem profundidade aromática e uma difusão subtil e duradoura.",
    icon: "droplet",
  },
  {
    title: "Algodão Natural",
    description:
      "Pavios de algodão puro, sem chumbo, para uma chama estável e uma combustão verdadeiramente limpa.",
    icon: "sprout",
  },
  {
    title: "Fragrâncias Premium",
    description:
      "Composições assinadas por mestres perfumistas europeus, com a sofisticação da alta perfumaria.",
    icon: "sparkles",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Escolha o seu ritual",
    description:
      "Selecione a fragrância que corresponde ao momento que deseja criar — calma, foco, descanso ou equilíbrio.",
  },
  {
    number: "02",
    title: "Acenda a vela",
    description:
      "Deixe a chama despertar os óleos essenciais e a fragrância difundir-se lentamente pelo ambiente.",
  },
  {
    number: "03",
    title: "Transforme o ambiente",
    description:
      "Respire e deixe o espaço transformar-se num refúgio sensorial de bem-estar e tranquilidade.",
  },
] as const;

export const trustItems = [
  "Ingredientes Naturais",
  "Cera de Soja",
  "Óleos Essenciais",
  "Produção Artesanal",
  "Envio para Toda a Europa",
] as const;

export const pressLogos = [
  "VOGUE",
  "ELLE DÉCOR",
  "MONOCLE",
  "KINFOLK",
  "ARCHITECTURAL DIGEST",
] as const;
