import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  supabase,
  getCurrentUser,
  getLeagueById,
  getTeamsByLeague,
  getUserTeam,
  createTeam,
} from "@/lib/supabase";

export default function LeaguePage() {
  const router = useRouter();
  const { leagueId } = router.query;

  const [user, setUser] = useState(null);
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leagueId) {
      loadLeague();
    }
  }, [leagueId]);

  async function loadLeague() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser(currentUser);

    const { data: leagueData } = await getLeagueById(leagueId);
    setLeague(leagueData);

    const { data: teamsData } = await getTeamsByLeague(leagueId);
    setTeams(teamsData || []);

    const { data: teamData } = await getUserTeam(leagueId, currentUser.id);
    setUserTeam(teamData || null);

    setLoading(false);
  }

  async function handleCreateTeam() {
    if (!teamName.trim()) {
      alert("Digite o nome do seu time.");
      return;
    }

    const { error } = await createTeam(teamName, leagueId, user.id);

    if (error) {
      alert("Erro ao criar time: " + error.message);
      return;
    }

    setTeamName("");
    loadLeague();
  }

  if (loading) {
    return <main style={styles.container}>Carregando liga...</main>;
  }

  if (!league) {
    return (
      <main style={styles.container}>
        <p>Liga não encontrada.</p>
        <button onClick={() => router.push("/dashboard")}>Voltar</button>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push("/dashboard")}>
          ← Voltar
        </button>

        <h1>{league.name}</h1>
        <p>Season {league.season}</p>
      </header>

      <section style={styles.content}>
        {!userTeam ? (
          <div style={styles.card}>
            <h2>Criar meu time</h2>
            <input
              style={styles.input}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nome do time"
            />
            <button style={styles.createButton} onClick={handleCreateTeam}>
              Criar Time
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <h2>Meu Time</h2>
            <p>{userTeam.name}</p>
            <p>
              {userTeam.wins}W - {userTeam.losses}L - {userTeam.ties}T
            </p>
          </div>
        )}

        <div style={styles.card}>
          <h2>Classificação</h2>

          {teams.length === 0 ? (
            <p>Nenhum time criado ainda.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>W</th>
                  <th style={styles.th}>L</th>
                  <th style={styles.th}>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{team.name}</td>
                    <td style={styles.td}>{team.wins}</td>
                    <td style={styles.td}>{team.losses}</td>
                    <td style={styles.td}>{team.total_points || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {userTeam && <Roster teamId={userTeam.id} />}
      </section>
    </main>
  );
}

function Roster({ teamId }) {
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    loadRoster();
  }, [teamId]);

  async function loadRoster() {
    const { data } = await supabase
      .from("rosters")
      .select("*, nba_players(*)")
      .eq("team_id", teamId)
      .eq("still_on_team", true);

    setRoster(data || []);
  }

  return (
    <div style={styles.card}>
      <h2>Roster</h2>

      {roster.length === 0 ? (
        <p>Seu roster ainda está vazio.</p>
      ) : (
        <ul>
          {roster.map((item) => (
            <li key={item.id}>
              {item.nba_players?.name} - {item.nba_players?.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0e27",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "24px 40px",
    background: "#1a1f3a",
  },
  backButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#2a2f4a",
    color: "#fff",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    display: "grid",
    gap: "20px",
  },
  card: {
    background: "#1a1f3a",
    border: "1px solid #2a2f4a",
    borderRadius: "8px",
    padding: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #2a2f4a",
    background: "#11162f",
    color: "#fff",
    marginBottom: "12px",
  },
  createButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    background: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    borderBottom: "1px solid #2a2f4a",
    padding: "10px",
  },
  td: {
    borderBottom: "1px solid #2a2f4a",
    padding: "10px",
  },
};
