import type { Selecao } from './tipos';

// 48 seleções nacionais plausíveis das 6 confederações.
// Nomes de países (não são marca) + bandeiras via emoji.
// Força: gigantes ~88–95, médios ~72–84, restantes ~60–71.
// Lista fácil de editar caso se queira meter os grupos reais depois.
export const SELECOES: Selecao[] = [
  // ---------- POTE 1 (mais fortes / anfitriões) ----------
  { id: 'FRA', nome: 'França', bandeira: '🇫🇷', forca: 93, pote: 1, cor: '#1e3a8a', confederacao: 'UEFA' },
  { id: 'BRA', nome: 'Brasil', bandeira: '🇧🇷', forca: 92, pote: 1, cor: '#f5c518', confederacao: 'CONMEBOL' },
  { id: 'ARG', nome: 'Argentina', bandeira: '🇦🇷', forca: 92, pote: 1, cor: '#6c9bd2', confederacao: 'CONMEBOL' },
  { id: 'ESP', nome: 'Espanha', bandeira: '🇪🇸', forca: 91, pote: 1, cor: '#c60b1e', confederacao: 'UEFA' },
  { id: 'ING', nome: 'Inglaterra', bandeira: '🏴', forca: 90, pote: 1, cor: '#cf1020', confederacao: 'UEFA' },
  { id: 'POR', nome: 'Portugal', bandeira: '🇵🇹', forca: 90, pote: 1, cor: '#006600', confederacao: 'UEFA' },
  { id: 'ALE', nome: 'Alemanha', bandeira: '🇩🇪', forca: 89, pote: 1, cor: '#111111', confederacao: 'UEFA' },
  { id: 'PBX', nome: 'Países Baixos', bandeira: '🇳🇱', forca: 88, pote: 1, cor: '#f15a22', confederacao: 'UEFA' },
  { id: 'EUA', nome: 'Estados Unidos', bandeira: '🇺🇸', forca: 80, pote: 1, cor: '#1c3f95', confederacao: 'CONCACAF' },
  { id: 'MEX', nome: 'México', bandeira: '🇲🇽', forca: 79, pote: 1, cor: '#006847', confederacao: 'CONCACAF' },
  { id: 'CAN', nome: 'Canadá', bandeira: '🇨🇦', forca: 76, pote: 1, cor: '#d52b1e', confederacao: 'CONCACAF' },
  { id: 'BEL', nome: 'Bélgica', bandeira: '🇧🇪', forca: 87, pote: 1, cor: '#c8102e', confederacao: 'UEFA' },

  // ---------- POTE 2 (médios-altos) ----------
  { id: 'CRO', nome: 'Croácia', bandeira: '🇭🇷', forca: 85, pote: 2, cor: '#d10000', confederacao: 'UEFA' },
  { id: 'ITA', nome: 'Itália', bandeira: '🇮🇹', forca: 86, pote: 2, cor: '#0b5394', confederacao: 'UEFA' },
  { id: 'URU', nome: 'Uruguai', bandeira: '🇺🇾', forca: 84, pote: 2, cor: '#5b9bd5', confederacao: 'CONMEBOL' },
  { id: 'COL', nome: 'Colômbia', bandeira: '🇨🇴', forca: 83, pote: 2, cor: '#fcd116', confederacao: 'CONMEBOL' },
  { id: 'MAR', nome: 'Marrocos', bandeira: '🇲🇦', forca: 83, pote: 2, cor: '#c1272d', confederacao: 'CAF' },
  { id: 'SUI', nome: 'Suíça', bandeira: '🇨🇭', forca: 81, pote: 2, cor: '#d52b1e', confederacao: 'UEFA' },
  { id: 'JAP', nome: 'Japão', bandeira: '🇯🇵', forca: 81, pote: 2, cor: '#bc002d', confederacao: 'AFC' },
  { id: 'SEN', nome: 'Senegal', bandeira: '🇸🇳', forca: 80, pote: 2, cor: '#00853f', confederacao: 'CAF' },
  { id: 'DIN', nome: 'Dinamarca', bandeira: '🇩🇰', forca: 82, pote: 2, cor: '#c8102e', confederacao: 'UEFA' },
  { id: 'AUS', nome: 'Austrália', bandeira: '🇦🇺', forca: 74, pote: 2, cor: '#00843d', confederacao: 'AFC' },
  { id: 'COR', nome: 'Coreia do Sul', bandeira: '🇰🇷', forca: 78, pote: 2, cor: '#0047a0', confederacao: 'AFC' },
  { id: 'IRA', nome: 'Irão', bandeira: '🇮🇷', forca: 75, pote: 2, cor: '#239f40', confederacao: 'AFC' },

  // ---------- POTE 3 (médios) ----------
  { id: 'SER', nome: 'Sérvia', bandeira: '🇷🇸', forca: 79, pote: 3, cor: '#c6363c', confederacao: 'UEFA' },
  { id: 'POL', nome: 'Polónia', bandeira: '🇵🇱', forca: 77, pote: 3, cor: '#dc143c', confederacao: 'UEFA' },
  { id: 'EQU', nome: 'Equador', bandeira: '🇪🇨', forca: 76, pote: 3, cor: '#ffd100', confederacao: 'CONMEBOL' },
  { id: 'AUT', nome: 'Áustria', bandeira: '🇦🇹', forca: 78, pote: 3, cor: '#ef3340', confederacao: 'UEFA' },
  { id: 'NIG', nome: 'Nigéria', bandeira: '🇳🇬', forca: 77, pote: 3, cor: '#008751', confederacao: 'CAF' },
  { id: 'TUN', nome: 'Tunísia', bandeira: '🇹🇳', forca: 72, pote: 3, cor: '#e70013', confederacao: 'CAF' },
  { id: 'EGI', nome: 'Egito', bandeira: '🇪🇬', forca: 76, pote: 3, cor: '#c8102e', confederacao: 'CAF' },
  { id: 'PER', nome: 'Peru', bandeira: '🇵🇪', forca: 73, pote: 3, cor: '#d91023', confederacao: 'CONMEBOL' },
  { id: 'CHI', nome: 'Chile', bandeira: '🇨🇱', forca: 74, pote: 3, cor: '#0033a0', confederacao: 'CONMEBOL' },
  { id: 'COS', nome: 'Costa do Marfim', bandeira: '🇨🇮', forca: 75, pote: 3, cor: '#f77f00', confederacao: 'CAF' },
  { id: 'ARA', nome: 'Arábia Saudita', bandeira: '🇸🇦', forca: 71, pote: 3, cor: '#006c35', confederacao: 'AFC' },
  { id: 'CRC', nome: 'Costa Rica', bandeira: '🇨🇷', forca: 70, pote: 3, cor: '#002b7f', confederacao: 'CONCACAF' },

  // ---------- POTE 4 (restantes) ----------
  { id: 'CAM', nome: 'Camarões', bandeira: '🇨🇲', forca: 72, pote: 4, cor: '#007a5e', confederacao: 'CAF' },
  { id: 'GAN', nome: 'Gana', bandeira: '🇬🇭', forca: 71, pote: 4, cor: '#006b3f', confederacao: 'CAF' },
  { id: 'ARG2', nome: 'Argélia', bandeira: '🇩🇿', forca: 73, pote: 4, cor: '#007229', confederacao: 'CAF' },
  { id: 'QAT', nome: 'Catar', bandeira: '🇶🇦', forca: 68, pote: 4, cor: '#8a1538', confederacao: 'AFC' },
  { id: 'PAR', nome: 'Paraguai', bandeira: '🇵🇾', forca: 70, pote: 4, cor: '#d52b1e', confederacao: 'CONMEBOL' },
  { id: 'PAN', nome: 'Panamá', bandeira: '🇵🇦', forca: 67, pote: 4, cor: '#005293', confederacao: 'CONCACAF' },
  { id: 'JAM', nome: 'Jamaica', bandeira: '🇯🇲', forca: 66, pote: 4, cor: '#009b3a', confederacao: 'CONCACAF' },
  { id: 'NZL', nome: 'Nova Zelândia', bandeira: '🇳🇿', forca: 63, pote: 4, cor: '#1c1c1c', confederacao: 'OFC' },
  { id: 'UZB', nome: 'Usbequistão', bandeira: '🇺🇿', forca: 68, pote: 4, cor: '#1eb53a', confederacao: 'AFC' },
  { id: 'AFS', nome: 'África do Sul', bandeira: '🇿🇦', forca: 69, pote: 4, cor: '#007a4d', confederacao: 'CAF' },
  { id: 'NOR', nome: 'Noruega', bandeira: '🇳🇴', forca: 80, pote: 4, cor: '#ba0c2f', confederacao: 'UEFA' },
  { id: 'TUR', nome: 'Turquia', bandeira: '🇹🇷', forca: 79, pote: 4, cor: '#e30a17', confederacao: 'UEFA' },
];

export const MAPA_SELECOES: Record<string, Selecao> = Object.fromEntries(
  SELECOES.map((s) => [s.id, s]),
);

export function getSelecao(id: string): Selecao {
  const s = MAPA_SELECOES[id];
  if (!s) {
    return {
      id,
      nome: id,
      bandeira: '🏳️',
      forca: 70,
      pote: 4,
      cor: '#64748b',
      confederacao: 'UEFA',
    };
  }
  return s;
}
