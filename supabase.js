/**
 * ⭐ INTEGRAÇÃO COM SUPABASE ⭐
 * 
 * Este arquivo conecta a app ao banco de dados Supabase
 * Você não precisa mexer aqui normalmente
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ Variáveis Supabase não configuradas!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * FUNÇÕES PARA USUÁRIOS
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * FUNÇÕES PARA LIGAS
 */
export async function createLeague(leagueName, userId) {
  const { data, error } = await supabase
    .from("leagues")
    .insert([
      {
        name: leagueName,
        season: new Date().getFullYear(),
        created_by: userId,
        status: "draft",
      },
    ])
    .select();

  return { data, error };
}

export async function getLeagues(userId) {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("created_by", userId);

  return { data, error };
}

export async function getLeagueById(leagueId) {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", leagueId)
    .single();

  return { data, error };
}

/**
 * FUNÇÕES PARA TIMES
 */
export async function createTeam(teamName, leagueId, userId) {
  const { data, error } = await supabase
    .from("teams")
    .insert([
      {
        name: teamName,
        league_id: leagueId,
        user_id: userId,
        wins: 0,
        losses: 0,
        ties: 0,
      },
    ])
    .select();

  return { data, error };
}

export async function getTeamsByLeague(leagueId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .order("wins", { ascending: false });

  return { data, error };
}

export async function getUserTeam(leagueId, userId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .eq("user_id", userId)
    .single();

  return { data, error };
}

/**
 * FUNÇÕES PARA JOGADORES
 */
export async function getNBAPlayers() {
  const { data, error } = await supabase
    .from("nba_players")
    .select("*")
    .eq("status", "available")
    .order("name");

  return { data, error };
}

export async function draftPlayer(playerId, teamId, round, pick) {
  const { data, error } = await supabase
    .from("rosters")
    .insert([
      {
        player_id: playerId,
        team_id: teamId,
        round_drafted: round,
        pick_drafted: pick,
      },
    ])
    .select();

  // Atualiza o jogador para não disponível
  await supabase
    .from("nba_players")
    .update({ status: "drafted" })
    .eq("id", playerId);

  return { data, error };
}

export async function getTeamRoster(teamId) {
  const { data, error } = await supabase
    .from("rosters")
    .select("*, nba_players(*)")
    .eq("team_id", teamId)
    .eq("still_on_team", true);

  return { data, error };
}

/**
 * FUNÇÕES PARA ESTATÍSTICAS
 */
export async function getDailyStats(playerId, date) {
  const { data, error } = await supabase
    .from("player_daily_stats")
    .select("*")
    .eq("player_id", playerId)
    .eq("date", date)
    .single();

  return { data, error };
}

export async function saveDailyStats(playerId, date, stats) {
  const { data, error } = await supabase
    .from("player_daily_stats")
    .upsert([
      {
        player_id: playerId,
        date: date,
        ...stats,
      },
    ])
    .select();

  return { data, error };
}

export async function getPlayerSeasonStats(playerId) {
  const { data, error } = await supabase
    .from("player_daily_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("date", { ascending: false });

  return { data, error };
}

/**
 * FUNÇÕES PARA MATCHUPS
 */
export async function getMatchupsByDate(leagueId, date) {
  const { data, error } = await supabase
    .from("daily_matchups")
    .select("*, teams!team_local(name), teams!team_visitante(name)")
    .eq("league_id", leagueId)
    .eq("date", date);

  return { data, error };
}

export async function getLeagueStandings(leagueId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .order("wins", { ascending: false });

  return { data, error };
}

/**
 * FUNÇÕES PARA TRADES
 */
export async function proposeTrade(leagueId, team1Id, team2Id, players1, players2) {
  const { data, error } = await supabase
    .from("trades")
    .insert([
      {
        league_id: leagueId,
        team_1_id: team1Id,
        team_2_id: team2Id,
        players_team1: players1,
        players_team2: players2,
        status: "proposed",
      },
    ])
    .select();

  return { data, error };
}

export async function getProposedTrades(teamId) {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .or(`team_1_id.eq.${teamId},team_2_id.eq.${teamId}`)
    .eq("status", "proposed");

  return { data, error };
}

/**
 * FUNÇÕES PARA FREE AGENCY
 */
export async function claimPlayer(playerId, teamId) {
  const { data, error } = await supabase
    .from("rosters")
    .insert([
      {
        player_id: playerId,
        team_id: teamId,
        round_drafted: null,
        pick_drafted: null,
      },
    ])
    .select();

  // Atualiza o jogador
  await supabase
    .from("nba_players")
    .update({ status: "drafted" })
    .eq("id", playerId);

  return { data, error };
}

export async function dropPlayer(rosterId) {
  const { data, error } = await supabase
    .from("rosters")
    .update({ still_on_team: false })
    .eq("id", rosterId);

  return { data, error };
}
