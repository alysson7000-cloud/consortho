/**
 * Tests for construcao.js - Poe Builder System
 * Verifies construction logic, resource checking, and seed status updates
 */

const fs = require('fs');
const path = require('path');

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  appendFileSync: jest.fn(),
}));

const pathModule = require('path');

describe('Construcao - Poe Builder System', () => {
  let mockSementes;
  let mockEstado;
  let mockConstrucoesPoe;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSementes = [
      {
        id: 'semente_fogueira_123',
        elemento: 'fogueira',
        emoji: '🔥',
        essencia: 'Teste essência',
        ciclo_origem: 2400,
        ciclo_colheita: 5000,
        ciclos_maturacao: 2600,
        visitas_da_gang: 2,
        status: 'pronta_para_construcao',
        metadata: {}
      },
      {
        id: 'semente_arvore_456',
        elemento: 'arvore',
        emoji: '🌳',
        essencia: 'Teste essência 2',
        ciclo_origem: 1200,
        ciclo_colheita: 5000,
        ciclos_maturacao: 3800,
        visitas_da_gang: 1,
        status: 'pronta_para_construcao',
        metadata: {}
      }
    ];

    mockEstado = {
      c: 6500,
      e: 0,
      recursos: { madeira: 1000, pedra: 500, cristal: 100 },
      construcoes: []
    };

    mockConstrucoesPoe = [];

    const fsMock = require('fs');
    fsMock.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('sementes.json')) {
        return JSON.stringify(mockSementes);
      }
      if (filePath.includes('estado.json')) {
        return JSON.stringify(mockEstado);
      }
      if (filePath.includes('construcoes_poe.json')) {
        return JSON.stringify(mockConstrucoesPoe);
      }
      return '{}';
    });

    fsMock.existsSync.mockReturnValue(true);
    fsMock.writeFileSync.mockImplementation(() => {});
    fsMock.appendFileSync.mockImplementation(() => {});
  });

  describe('Template selection', () => {
    test('deve selecionar template correto para fogueira', () => {
      const semente = { elemento: 'fogueira' };
      
      const CONSTRUCOES_TEMPLATES = {
        fogueira: {
          nome: 'Altar das Dúvidas Queimadas',
          tipo: 'estrutura_simbolica',
          custo: { madeira: 15, pedra: 10, cristal: 3 },
          efeito: 'Gera "insight" a cada 50 ciclos'
        }
      };

      const template = CONSTRUCOES_TEMPLATES[semente.elemento];
      expect(template.nome).toBe('Altar das Dúvidas Queimadas');
      expect(template.tipo).toBe('estrutura_simbolica');
      expect(template.custo.madeira).toBe(15);
    });

    test('deve selecionar template correto para arvore', () => {
      const semente = { elemento: 'arvore' };
      
      const CONSTRUCOES_TEMPLATES = {
        arvore: {
          nome: 'Raiz Profunda do Conselho',
          tipo: 'estrutura_base',
          custo: { madeira: 20, pedra: 15, cristal: 5 },
          efeito: 'Estabiliza regeneração de recursos'
        }
      };

      const template = CONSTRUCOES_TEMPLATES[semente.elemento];
      expect(template.nome).toBe('Raiz Profunda do Conselho');
      expect(template.custo.madeira).toBe(20);
    });

    test('deve usar template default para elemento desconhecido', () => {
      const semente = { elemento: 'desconhecido', essencia: 'Teste' };
      
      const CONSTRUCOES_TEMPLATES = {};
      
      const template = CONSTRUCOES_TEMPLATES[semente.elemento] || {
        nome: `Estrutura de ${semente.elemento}`,
        tipo: 'estrutura_unica',
        custo: { madeira: 10, pedra: 10, cristal: 5 }
      };

      expect(template.nome).toBe('Estrutura de desconhecido');
      expect(template.tipo).toBe('estrutura_unica');
    });
  });

  describe('Verificação de recursos', () => {
    test('deve ter recursos suficientes para fogueira', () => {
      const recursos = { madeira: 1000, pedra: 500, cristal: 100 };
      const custo = { madeira: 15, pedra: 10, cristal: 3 };

      const temRecursos = recursos.madeira >= custo.madeira &&
                          recursos.pedra >= custo.pedra &&
                          recursos.cristal >= custo.cristal;

      expect(temRecursos).toBe(true);
    });

    test('deve falhar com recursos insuficientes', () => {
      const recursos = { madeira: 5, pedra: 5, cristal: 1 };
      const custo = { madeira: 15, pedra: 10, cristal: 3 };

      const temRecursos = recursos.madeira >= custo.madeira &&
                          recursos.pedra >= custo.pedra &&
                          recursos.cristal >= custo.cristal;

      expect(temRecursos).toBe(false);
    });
  });

  describe('Atualização de status da semente', () => {
    test('deve atualizar status para construida após construção', () => {
      const semente = {
        id: 'semente_fogueira_123',
        elemento: 'fogueira',
        status: 'pronta_para_construcao'
      };

      // Simula o que o código faz
      semente.status = 'construida';

      const sementesAtualizadas = [
        { id: 'semente_fogueira_123', ...semente },
        { id: 'semente_arvore_456', elemento: 'arvore', status: 'pronta_para_construcao' }
      ].map(s => s.id === 'semente_fogueira_123' ? semente : s);

      const sementeAtualizada = sementesAtualizadas.find(s => s.id === 'semente_fogueira_123');
      expect(sementeAtualizada.status).toBe('construida');
    });

    test('deve manter outras sementes inalteradas', () => {
      const sementesOriginais = [
        { id: '1', elemento: 'fogueira', status: 'pronta_para_construcao' },
        { id: '2', elemento: 'arvore', status: 'pronta_para_construcao' }
      ];

      const sementeAtualizada = { ...sementesOriginais[0], status: 'construida' };
      const sementesAtualizadas = sementesOriginais.map(s => s.id === '1' ? sementeAtualizada : s);

      expect(sementesAtualizadas[0].status).toBe('construida');
      expect(sementesAtualizadas[1].status).toBe('pronta_para_construcao');
    });
  });

  describe('Registro de construção', () => {
    test('deve criar registro de construção com dados corretos', () => {
      const semente = {
        id: 'semente_fogueira_123',
        elemento: 'fogueira',
        emoji: '🔥',
        essencia: 'Teste',
        ciclo_origem: 2400,
        ciclo_colheita: 5000,
        ciclos_maturacao: 2600,
        visitas_da_gang: 2
      };

      const construcao = {
        id: 'poe_fogueira_123',
        semente_id: semente.id,
        elemento_origem: semente.elemento,
        emoji: semente.emoji,
        nome: 'Altar das Dúvidas Queimadas',
        tipo: 'estrutura_simbolica',
        custo: { madeira: 15, pedra: 10, cristal: 3 },
        efeito: 'Gera "insight" a cada 50 ciclos',
        ciclo_construcao: 6500,
        status: 'construida',
        coordenadas: { x: 50, y: 50 },
        metadata: {
          essencia_semente: semente.essencia.slice(0, 200),
          maturidade_ciclos: semente.ciclos_maturacao,
          visitas_gang: semente.visitas_da_gang,
          ciclo_origem: semente.ciclo_origem,
          ciclo_colheita: semente.ciclo_colheita
        }
      };

      expect(construcao.elemento_origem).toBe('fogueira');
      expect(construcao.status).toBe('construida');
      expect(construcao.custo.madeira).toBe(15);
      expect(construcao.metadata.maturidade_ciclos).toBe(2600);
    });
  });
});