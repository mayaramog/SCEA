// Feriados nacionais brasileiros de 2026
const FERIADOS_2026 = [
  new Date(2026, 0, 1),   // Confraternização Universal
  new Date(2026, 1, 16),  // Carnaval (Segunda-feira)
  new Date(2026, 1, 17),  // Carnaval (Terça-feira)
  new Date(2026, 3, 3),   // Paixão de Cristo
  new Date(2026, 3, 21),  // Tiradentes
  new Date(2026, 4, 1),   // Dia do Trabalhador
  new Date(2026, 5, 4),   // Corpus Christi
  new Date(2026, 8, 7),   // Independência do Brasil
  new Date(2026, 9, 12),  // Nossa Senhora Aparecida
  new Date(2026, 10, 2),  // Finados
  new Date(2026, 10, 15), // Proclamação da República
  new Date(2026, 10, 20), // Consciência Negra
  new Date(2026, 11, 25), // Natal
];

/**
 * Verifica se uma data é um final de semana (sábado ou domingo)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = domingo, 6 = sábado
}

/**
 * Verifica se uma data é um feriado nacional brasileiro
 */
export function isFeriado(date: Date): boolean {
  return FERIADOS_2026.some(
    (feriado) =>
      feriado.getDate() === date.getDate() &&
      feriado.getMonth() === date.getMonth() &&
      feriado.getFullYear() === date.getFullYear()
  );
}

/**
 * Valida se uma data está em um dia útil (não é fim de semana nem feriado)
 */
export function isDiaUtil(date: Date): boolean {
  return !isWeekend(date) && !isFeriado(date);
}

/**
 * Valida um intervalo de datas para protocolo de experimentação
 * Regras:
 * - Data de início deve ser anterior à data de término
 * - Ambas as datas devem ser dias úteis (não podem ser finais de semana ou feriados)
 */
export function validateDataRange(
  dataInicio: Date,
  dataTermino: Date
): { isValid: boolean; error?: string } {
  // Verifica se data de início é anterior à data de término
  if (dataInicio >= dataTermino) {
    return {
      isValid: false,
      error: 'A data de início deve ser anterior à data de término',
    };
  }

  // Verifica se data de início é final de semana
  if (isWeekend(dataInicio)) {
    return {
      isValid: false,
      error: 'A data de início não pode cair em final de semana (sábado ou domingo)',
    };
  }

  // Verifica se data de término é final de semana
  if (isWeekend(dataTermino)) {
    return {
      isValid: false,
      error: 'A data de término não pode cair em final de semana (sábado ou domingo)',
    };
  }

  // Verifica se data de início é feriado
  if (isFeriado(dataInicio)) {
    return {
      isValid: false,
      error: 'A data de início não pode coincidir com um feriado nacional',
    };
  }

  // Verifica se data de término é feriado
  if (isFeriado(dataTermino)) {
    return {
      isValid: false,
      error: 'A data de término não pode coincidir com um feriado nacional',
    };
  }

  return { isValid: true };
}

/**
 * Retorna o nome de um feriado brasileiro, se a data for um feriado
 */
export function getNomeFeriado(date: Date): string | null {
  const feriadosComNomes = [
    { data: new Date(2026, 0, 1), nome: 'Confraternização Universal' },
    { data: new Date(2026, 1, 16), nome: 'Segunda-feira de Carnaval' },
    { data: new Date(2026, 1, 17), nome: 'Terça-feira de Carnaval' },
    { data: new Date(2026, 3, 3), nome: 'Paixão de Cristo' },
    { data: new Date(2026, 3, 21), nome: 'Tiradentes' },
    { data: new Date(2026, 4, 1), nome: 'Dia do Trabalhador' },
    { data: new Date(2026, 5, 4), nome: 'Corpus Christi' },
    { data: new Date(2026, 8, 7), nome: 'Independência do Brasil' },
    { data: new Date(2026, 9, 12), nome: 'Nossa Senhora Aparecida' },
    { data: new Date(2026, 10, 2), nome: 'Finados' },
    { data: new Date(2026, 10, 15), nome: 'Proclamação da República' },
    { data: new Date(2026, 10, 20), nome: 'Dia da Consciência Negra' },
    { data: new Date(2026, 11, 25), nome: 'Natal' },
  ];

  const feriado = feriadosComNomes.find(
    (f) =>
      f.data.getDate() === date.getDate() &&
      f.data.getMonth() === date.getMonth() &&
      f.data.getFullYear() === date.getFullYear()
  );

  return feriado ? feriado.nome : null;
}
