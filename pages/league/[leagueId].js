/**
 * Página da Liga
 * Mostra a liga com abas: Roster, Classificação, Estatísticas, Matchups
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase, getCurrentUser, getLeagueById, getTeamsByLeague, getUserTeam } from "@/lib/supabase";

export default function LeaguePage() {
  const router = useRouter();
  const { leagueId } = router.query;
  const [user, setUser] = useState(null);
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [activeTab, setActiveTab] = useState("standings");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leagueId) {
      loadLeagueData();
    }
  }, [leagueId]);

  const loadLeagueData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Carrega dados da liga
      const { data: leagueData } = await getLeagueById(leagueId);
      setLeague(leagueData);

      // Carrega times da liga
      const { data: teamsData } = await getTeamsByLeague(leagueId);
      setTeams(teamsData || []);

      // Carrega time do usuário
      const { data: userTeamData } = await getUserTeam(leagueId, currentUser.id);
      setUserTeam(userTeamData);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}><p style={{ color: "#fff" }}>Carregando liga...</p></div>;
  }

  if (!league) {
    return <div style={styles.container}><p style={{ color: "#fff" }}>Liga não encontrada</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <button onClick={() => router.push("/dashboard")} style={styles.backBtn}>
            ← Voltar
          </button>
          <h1 style={styles.title}>{league.name}</h1>
          <p style={styles.subtitle}>Season {league.season}</p>
        </div>
        {userTeam && (
          <div style={styles.userTeamInfo}>
            <h3 style={styles.userTeamName}>{userTeam.name}</h3>
            <p style={styles.record}>{userTeam.wins}W - {userTeam.losses}L</p>
          </div>
        )}
      </div>

      <div style={styles.tabs}>
        {["standings", "roster", "stats", "matchups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab ? "#1f6feb" : "#1a1f3a",
            }}
          >
            {tab === "standings" && "📊 Classificação"}
            {tab === "roster" && "👥 Meu Roster"}
            {tab === "stats" && "📈 Estatísticas"}
            {tab === "matchups" && "🎮 Matchups"}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === "standings" && <StandingsTab teams={teams} />}
        {activeTab === "roster" && userTeam && <RosterTab teamId={userTeam.id} />}
        {activeTab === "stats" && <StatsTab leagueId={leagueId} />}
        {activeTab === "matchups" && <MatchupsTab leagueId={leagueId} />}
      </div>
    </div>
  );
}

function StandingsTab({ teams }) {
  return (
    <div style={styles.tabContent}>
      <h2 style={styles.tabTitle}>Classificação da Liga</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Posição</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>W</th>
            <th style={styles.th}>L</th>
            <th style={styles.th}>%</th>
            <th style={styles.th}>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => {
            const totalGames = team.wins + team.losses;
            const winPct = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(1) : "0.0";
            return (
              <tr key={team.id} style={styles.tableRow}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{team.name}</td>
                <td style={styles.td}>{team.wins}</td>
                <td style={styles.td}>{team.losses}</td>
                <td style={styles.td}>{winPct}%</td>
                <td style={styles.td}>{(team.total_points || 0).toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RosterTab({ teamId }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoster();
  }, [teamId]);

  const loadRoster = async () => {
    try {
      const { data } = await supabase
        .from("rosters")
        .select("*, nba_players(*)")
        .eq("team_id", teamId)
        .eq("still_on_team", true);

      setRoster(data || []);
    } catch (error) {
      console.error("Erro ao carregar roster:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#fff" }}>Carregando roster...</p>;
  }

  return (
    <div style={styles.tabContent}>
      <h2 style={styles.tabTitle}>Seu Roster</h2>
      {roster.length === 0 ? (
        <p style={{ color: "#8b8d99" }}>Seu roster está vazio. Comece o draft!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Jogador</th>
              <th style={styles.th}>Pos</th>
              <th style={styles.th}>Time NBA</th>
              <th style={styles.th}>Round</th>
              <th style={styles.th}>Pick</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((item) => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={styles.td}>{item.nba_players?.name}</td>
                <td style={styles.td}>{item.nba_players?.position}</td>
                <td style={styles.td}>{item.nba_players?.nba_team}</td>
                <td style={styles.td}>{item.round_drafted || "-"}</td>
                <td style={styles.td}>{item.pick_drafted || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatsTab({ leagueId }) {
  return (
    <div style={styles.tabContent}>
      <h2 style={styles.tabTitle}>Estatísticas dos Jogadores</h2>
      <p style={{ color: "#8b8d99" }}>Em breve: Estatísticas detalhadas de todos os jogadores</p>
    </div>
  );
}

function MatchupsTab({ leagueId }) {
  return (
    <div style={styles.tabContent}>
      <h2 style={styles.tabTitle}>Matchups</h2>
      <p style={{ color: "#8b8d99" }}>Em breve: Matchups da semana</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0e27",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  header: {
    backgroundColor: "#1a1f3a",
    padding: "20px 40px",
    borderBottom: "1px solid #2a2f4a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "#2a2f4a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  title: {
    margin: "0 0 5px 0",
    fontSize: "32px",
  },
  subtitle: {
    margin: "0",
    color: "#8b8d99",
    fontSize: "14px",
  },
  userTeamInfo: {
    backgroundColor: "#0a0e27",
    padding: "15px 20px",
    borderRadius: "6px",
  },
  userTeamName: {
    margin: "0",
    fontSize: "16px",
  },
  record: {
    margin: "5px 0 0 0",
    color: "#8b8d99",
    fontSize: "14px",
  },
  tabs: {
    display: "flex",
    backgroundColor: "#1a1f3a",
    borderBottom: "1px solid #2a2f4a",
    paddingLeft: "40px",
    gap: "5px",
  },
  tab: {
    padding: "15px 20px",
    backgroundColor: "#1a1f3a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    fontSize: "14px",
    fontWeight: "bold",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 40px",
  },
  tabContent: {
    backgroundColor: "#1a1f3a",
    padding: "30px",
    borderRadius: "8px",
  },
  tabTitle: {
    marginTop: "0",
    fontSize: "20px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#0a0e27",
  },
  tableHeader: {
    backgroundColor: "#2a2f4a",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    borderBottom: "1px solid #2a2f4a",
  },
  tableRow: {
    borderBottom: "1px solid #2a2f4a",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
  },
};
