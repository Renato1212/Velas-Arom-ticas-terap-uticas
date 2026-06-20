import { useMemo, useState } from 'react';
import { getSelecao } from './data/selecoes';
import type { Marcador } from './engine/motorPartida';
import { grupoDoJogador } from './engine/sorteio';
import { rotuloRonda } from './engine/eliminatorias';
import {
  confrontoDoJogador,
  existeSave,
  proximoJogoGrupo,
  useJogo,
} from './state/useJogo';
import { EcraInicial } from './components/EcraInicial';
import { EcraGrupos } from './components/EcraGrupos';
import { EcraPreJogo } from './components/EcraPreJogo';
import { JogoFutebol } from './components/JogoFutebol';
import { EcraPenaltis } from './components/EcraPenaltis';
import { EcraFinal } from './components/EcraFinal';
import { Quadro } from './components/Quadro';
import { Botao } from './components/ui/Botao';

type Vista = 'overview' | 'pre' | 'partida' | 'penaltis' | 'quadro';

type ContextoPartida = {
  casaId: string;
  foraId: string;
  advId: string;
  rotuloFase: string;
  isKnockout: boolean;
};

export default function App() {
  const jogo = useJogo();
  const { estado } = jogo;
  const [vista, setVista] = useState<Vista>('overview');
  // Golos guardados entre o fim do prolongamento e o mini-jogo de penáltis.
  const [pendentePenaltis, setPendentePenaltis] = useState<{
    golosCasa: number;
    golosFora: number;
  } | null>(null);

  const temSave = useMemo(() => existeSave(), [estado]);

  // ---- Sem estado: ecrã inicial ----
  if (!estado) {
    return (
      <EcraInicial
        temSave={temSave}
        onNovo={(id) => {
          jogo.novoTorneio(id);
          setVista('overview');
        }}
        onContinuar={() => {
          jogo.continuar();
          setVista('overview');
        }}
        onRecomecar={jogo.recomecar}
      />
    );
  }

  // ---- Contexto da partida atual do jogador ----
  function obterContexto(): ContextoPartida | null {
    if (!estado) return null;
    if (estado.faseAtual === 'grupos') {
      const grupo = grupoDoJogador(estado.grupos, estado.selecaoDoJogador);
      const jogo = proximoJogoGrupo(grupo, estado.selecaoDoJogador);
      if (!jogo) return null;
      const advId =
        jogo.casaId === estado.selecaoDoJogador ? jogo.foraId : jogo.casaId;
      return {
        casaId: jogo.casaId,
        foraId: jogo.foraId,
        advId,
        rotuloFase: `Fase de Grupos · Grupo ${grupo.letra}`,
        isKnockout: false,
      };
    }
    const c = confrontoDoJogador(estado);
    if (!c || !c.casaId || !c.foraId) return null;
    const advId = c.casaId === estado.selecaoDoJogador ? c.foraId : c.casaId;
    return {
      casaId: c.casaId,
      foraId: c.foraId,
      advId,
      rotuloFase: rotuloRonda(c.ronda),
      isKnockout: true,
    };
  }

  const ctx = obterContexto();

  function aoTerminarPartida(
    marcador: Marcador,
    info: { prolongamento: boolean; precisaPenaltis: boolean },
  ) {
    if (!ctx) return;
    if (!ctx.isKnockout) {
      jogo.registarJogoGrupo(marcador);
      setVista('overview');
      return;
    }
    if (info.precisaPenaltis) {
      setPendentePenaltis({ golosCasa: marcador.golosCasa, golosFora: marcador.golosFora });
      setVista('penaltis');
      return;
    }
    jogo.registarEliminatoria({
      golosCasa: marcador.golosCasa,
      golosFora: marcador.golosFora,
      prolongamento: info.prolongamento,
    });
    setVista('overview');
  }

  function aoTerminarPenaltis(penCasa: number, penFora: number) {
    if (!pendentePenaltis) return;
    jogo.registarEliminatoria({
      golosCasa: pendentePenaltis.golosCasa,
      golosFora: pendentePenaltis.golosFora,
      penCasa,
      penFora,
      prolongamento: true,
    });
    setPendentePenaltis(null);
    setVista('overview');
  }

  // ---- Render por vista ----
  const conteudo = () => {
    if (estado.faseAtual === 'fim') {
      if (vista === 'quadro') {
        return (
          <div className="max-w-5xl mx-auto">
            <div className="px-4 pt-4">
              <Botao variante="secundario" tamanho="sm" onClick={() => setVista('overview')}>
                ← Voltar
              </Botao>
            </div>
            <Quadro estado={estado} />
          </div>
        );
      }
      return (
        <EcraFinal
          estado={estado}
          onJogarDeNovo={() => {
            jogo.recomecar();
            setVista('overview');
          }}
          onVerQuadro={() => setVista('quadro')}
        />
      );
    }

    if (vista === 'pre' && ctx) {
      return (
        <EcraPreJogo
          idJogador={estado.selecaoDoJogador}
          advId={ctx.advId}
          rotuloFase={ctx.rotuloFase}
          formacao={estado.formacaoJogador}
          mentalidade={estado.mentalidade}
          onDefinir={jogo.definirTatica}
          onComecar={() => setVista('partida')}
        />
      );
    }

    if (vista === 'partida' && ctx) {
      return (
        <JogoFutebol
          key={`${ctx.casaId}-${ctx.foraId}-${estado.faseAtual}`}
          casaId={ctx.casaId}
          foraId={ctx.foraId}
          idJogador={estado.selecaoDoJogador}
          rotuloFase={ctx.rotuloFase}
          formacaoJogador={estado.formacaoJogador}
          mentalidadeInicial={estado.mentalidade}
          isKnockout={ctx.isKnockout}
          onFim={aoTerminarPartida}
        />
      );
    }

    if (vista === 'penaltis' && ctx) {
      return (
        <EcraPenaltis
          casaId={ctx.casaId}
          foraId={ctx.foraId}
          idJogador={estado.selecaoDoJogador}
          onFim={aoTerminarPenaltis}
        />
      );
    }

    // overview
    if (estado.faseAtual === 'grupos') {
      return <EcraGrupos estado={estado} onJogar={() => setVista('pre')} />;
    }

    // Overview das eliminatórias: próximo jogo + quadro.
    const adv = ctx ? getSelecao(ctx.advId) : null;
    return (
      <div className="max-w-5xl mx-auto px-2 py-4">
        {ctx && adv && (
          <div className="mx-2 mb-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {ctx.rotuloFase} · Próximo jogo
              </p>
              <p className="font-display font-bold text-white text-lg">
                {getSelecao(estado.selecaoDoJogador).bandeira}{' '}
                {getSelecao(estado.selecaoDoJogador).nome}
                <span className="text-white/40 px-2">vs</span>
                {adv.bandeira} {adv.nome}
              </p>
            </div>
            <Botao tamanho="lg" onClick={() => setVista('pre')}>
              ⚽ Jogar
            </Botao>
          </div>
        )}
        <Quadro estado={estado} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-noite-900 to-noite-950">
      <BarraTopo
        idJogador={estado.selecaoDoJogador}
        onRecomecar={() => {
          if (confirm('Recomeçar? O torneio atual será apagado.')) {
            jogo.recomecar();
            setVista('overview');
          }
        }}
        emJogo={vista === 'partida' || vista === 'penaltis'}
      />
      {conteudo()}
    </div>
  );
}

function BarraTopo({
  idJogador,
  onRecomecar,
  emJogo,
}: {
  idJogador: string;
  onRecomecar: () => void;
  emJogo: boolean;
}) {
  const s = getSelecao(idJogador);
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-noite-950/70 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <p className="font-display font-black text-white text-sm sm:text-base">
          <span className="text-amber-400">Copa</span> 2026
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70 flex items-center gap-1.5">
            <span aria-hidden>{s.bandeira}</span>
            <span className="hidden sm:inline">{s.nome}</span>
          </span>
          {!emJogo && (
            <button
              onClick={onRecomecar}
              className="text-xs text-white/40 hover:text-white/80 underline"
            >
              Recomeçar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
