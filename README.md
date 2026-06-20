# Caminho para a Glória — Copa 2026 ⚽🏆

Um **jogo de futebol jogável** num torneio inspirado no Mundial de 2026, totalmente em
**português de Portugal**. Escolhes uma seleção, defines a tática e **jogas tu próprio
cada partida** num campo 2D em tempo real — do sorteio até erguer o troféu.

> 100% no cliente, sem backend. **Baseado em perícia, não na sorte**: o resultado das
> tuas partidas depende exclusivamente da forma como jogas.

---

## 🎮 Como se joga uma partida

Cada jogo é disputado num campo 2D visto de cima. Controlas o jogador com o **anel
amarelo** (o da tua equipa mais próximo da bola — a seleção é automática).

- **Mover:** `WASD` / setas (teclado) ou o **joystick** no canto inferior esquerdo (telemóvel).
- **Driblar:** a bola cola-se ao teu jogador enquanto te moves.
- **Rematar / passar:** `Espaço` (teclado) ou o botão **CHUTAR** (telemóvel).
  **Mantém premido** para carregar mais força — a barra mostra a potência. A bola sai na
  direção em que estás virado, por isso **a tua pontaria decide tudo**.
- **Defender / roubar:** leva o teu jogador até à bola para a recuperar ao adversário.
- **Marcar golo:** ultrapassa a defesa e bate o guarda-redes apontando ao canto contrário.

Não há rolar de dados: seleções mais fortes têm jogadores mais rápidos e defesas mais
sólidas (mais difíceis), mas **batíveis com boa jogada**.

---

## ✨ Funcionalidades

- **48 seleções** divididas em **12 grupos de 4** (Grupos A a L), com potes para o sorteio.
- **Sorteio** automático a partir dos potes (Portugal e Brasil incluídos e bem cotados).
- **Fase de grupos** com cálculo de pontos e **critérios oficiais de desempate**
  (diferença de golos → golos marcados → confronto direto → fair-play → sorteio).
- Apuramento dos **2 primeiros de cada grupo + 8 melhores terceiros** (32 equipas).
- **Eliminatórias** da Ronda dos 32 até à Final, com **jogo do 3.º lugar**.
- **Partidas jogáveis em tempo real** (motor de futebol 2D próprio), com placar, relógio,
  física da bola e IA das equipas — sem qualquer aleatoriedade.
- Antes de cada jogo: escolha de **formação** (4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2) e
  **mentalidade** (defensiva / equilibrada / ofensiva), que alteram a posição da tua equipa.
- Durante o jogo: até **3 ajustes táticos** de mentalidade ao vivo.
- Empates nas eliminatórias → **mini-jogo de grandes penalidades** interativo (escolhe o
  canto e acerta na barra de precisão; defende escolhendo o lado).
- Os jogos que não disputas são resolvidos de forma **determinística pela força** das
  equipas — nada fica entregue à sorte.
- **Quadro/bracket** visual com o percurso do jogador destacado.
- Ecrã de **campeão** com celebração (ou de eliminação com resumo do percurso).
- **Persistência** em `localStorage`: continua o torneio onde ficaste; botão de recomeçar.
- Design **responsivo** (funciona bem em telemóvel), com foco visível e bom contraste.

---

## 🛠️ Stack

- **React 18 + Vite + TypeScript**
- **TailwindCSS** para os estilos e animações
- Sem dependências pesadas; animações em CSS/Tailwind

---

## 🚀 Como correr localmente

Pré-requisito: **Node.js 18+**.

```bash
npm install
npm run dev
```

Abre o endereço indicado no terminal (por defeito `http://localhost:5173`).

### Build de produção

```bash
npm run build      # verifica os tipos (tsc) e gera a pasta dist/
npm run preview    # serve localmente o build de produção
```

---

## ▲ Deploy na Vercel

O projeto já inclui um `vercel.json` configurado para Vite.

1. Faz push do repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), escolhe **Add New… → Project** e importa o repositório.
3. A Vercel deteta o Vite automaticamente:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clica em **Deploy**. Pronto!

Alternativa por linha de comandos:

```bash
npm i -g vercel
vercel        # pré-visualização
vercel --prod # produção
```

---

## 📁 Estrutura

```
src/
  data/        selecoes.ts, potes.ts, tipos.ts   (dados e tipos)
  engine/      sorteio, classificacao, eliminatorias, penaltis,
               motorFutebol (jogo 2D em tempo real),
               resolverDeterministico (jogos de fundo), aleatorio
  state/       useJogo.ts  (estado global + save/load)
  components/  EcraInicial, EcraGrupos, EcraPreJogo, JogoFutebol,
               EcraPenaltis, Quadro, EcraFinal, TabelaClassificacao, ui/
  App.tsx, main.tsx
```

A lista de seleções em `src/data/selecoes.ts` é fácil de editar — podes ajustar forças,
cores ou substituir pelos grupos reais quando quiseres.

---

## ⚖️ Notas legais

Não são usados logótipos nem marcas oficiais. Apenas **nomes de seleções nacionais**
(nomes de países não são marca) e **bandeiras via emoji**. Os jogadores são genéricos.
Tudo original, livre para publicar.
