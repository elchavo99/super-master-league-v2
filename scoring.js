/**
 * ⭐ ARQUIVO DE CONFIGURAÇÃO DE SCORING ⭐
 * 
 * MUDE AQUI para ajustar os pontos de cada estatística
 * Exemplo: Se quer que FT Made valha 1.5 em vez de 1.0
 * Mude FT_MADE: 1.5
 * 
 * Os valores estão em pontos por ação
 */

export const SCORING_CONFIG = {
  // Tiros livres
  FT_MADE: 1.0,
  FT_ATTEMPTED: -0.2,

  // 2 pontos
  TWO_POINTS_MADE: 2.0,
  TWO_POINTS_ATTEMPTED: -0.4,

  // 3 pontos
  THREE_POINTS_MADE: 3.0,
  THREE_POINTS_ATTEMPTED: -0.4,

  // Rebotes
  OFFENSIVE_REBOUNDS: 1.2,
  DEFENSIVE_REBOUNDS: 1.0,

  // Assistências e roubos
  ASSISTS: 1.1,
  STEALS: 1.2,
  BLOCKS: 1.2,

  // Turnovers
  TURNOVERS: -1.1,

  // Vitórias e derrotas
  WINS: 1.0,
  LOSSES: -1.0,
};

/**
 * ⭐ AJUSTES DE MATCHUP ⭐
 * 
 * Pontos adicionados/removidos no matchup
 * Time local começa com +3
 * Time visitante começa com -3
 */
export const MATCHUP_ADJUSTMENTS = {
  LOCAL_BONUS: 3,
  VISITANTE_BONUS: -3,
};

/**
 * ⭐ CONFIGURAÇÕES GERAIS ⭐
 */
export const LEAGUE_CONFIG = {
  NOME_LIGA: "Super Master League v2",
  SEASON: 2025,
  TOTAL_TEAMS: 30,
  MAX_PLAYERS_PER_TEAM: 15,
  DRAFT_TYPE: "snake", // "snake" ou "standard"
};

/**
 * Função para calcular pontos de um jogador
 * Use esta função em todo o código
 */
export function calculatePlayerPoints(stats) {
  let points = 0;

  points += (stats.ft_made || 0) * SCORING_CONFIG.FT_MADE;
  points += (stats.ft_attempted || 0) * SCORING_CONFIG.FT_ATTEMPTED;
  points += (stats.two_points_made || 0) * SCORING_CONFIG.TWO_POINTS_MADE;
  points += (stats.two_points_attempted || 0) * SCORING_CONFIG.TWO_POINTS_ATTEMPTED;
  points += (stats.three_points_made || 0) * SCORING_CONFIG.THREE_POINTS_MADE;
  points += (stats.three_points_attempted || 0) * SCORING_CONFIG.THREE_POINTS_ATTEMPTED;
  points += (stats.offensive_rebounds || 0) * SCORING_CONFIG.OFFENSIVE_REBOUNDS;
  points += (stats.defensive_rebounds || 0) * SCORING_CONFIG.DEFENSIVE_REBOUNDS;
  points += (stats.assists || 0) * SCORING_CONFIG.ASSISTS;
  points += (stats.steals || 0) * SCORING_CONFIG.STEALS;
  points += (stats.blocks || 0) * SCORING_CONFIG.BLOCKS;
  points += (stats.turnovers || 0) * SCORING_CONFIG.TURNOVERS;
  points += (stats.wins || 0) * SCORING_CONFIG.WINS;
  points += (stats.losses || 0) * SCORING_CONFIG.LOSSES;

  return Math.round(points * 100) / 100; // Arredonda para 2 casas decimais
}

/**
 * Função para calcular pontos de um time em um matchup
 */
export function calculateTeamMatchupPoints(teamPoints, isLocal) {
  const adjustment = isLocal ? MATCHUP_ADJUSTMENTS.LOCAL_BONUS : MATCHUP_ADJUSTMENTS.VISITANTE_BONUS;
  return Math.round((teamPoints + adjustment) * 100) / 100;
}
