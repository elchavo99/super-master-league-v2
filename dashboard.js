/**
 * Dashboard - Página Principal
 * Mostra as ligas do usuário e opções
 */

import { useState, useEffect } from "react";
import { supabase, getLeagues, signOut, getCurrentUser } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndLoadLeagues();
  }, []);

  const checkUserAndLoadLeagues = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Carrega as ligas do usuário
      const { data, error } = await getLeagues(currentUser.id);
      if (error) {
        console.error("Erro ao carregar ligas:", error);
        return;
      }
      setLeagues(data || []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeague = async () => {
    if (!newLeagueName.trim()) {
      alert("Digite um nome para a liga!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("leagues")
        .insert([
          {
            name: newLeagueName,
            season: new Date().getFullYear(),
            created_by: user.id,
            status: "draft",
          },
        ])
        .select();

      if (error) {
        alert("Erro ao criar liga: " + error.message);
        return;
      }

      setLeagues([...leagues, data[0]]);
      setNewLeagueName("");
      setShowCreateLeague(false);
      alert("Liga criada com sucesso!");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#fff" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏀 Super Master League v2</h1>
        <div style={styles.userInfo}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Minhas Ligas</h2>

          {leagues.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                Você ainda não criou nenhuma liga. Crie uma agora!
              </p>
            </div>
          ) : (
            <div style={styles.leaguesList}>
              {leagues.map((league) => (
                <div
                  key={league.id}
                  style={styles.leagueCard}
                  onClick={() => router.push(`/league/${league.id}`)}
                >
                  <h3 style={styles.leagueName}>{league.name}</h3>
                  <p style={styles.leagueInfo}>
                    {league.season} • Status: {league.status}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/league/${league.id}`);
                    }}
                    style={styles.openBtn}
                  >
                    Abrir Liga
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.section}>
          {!showCreateLeague ? (
            <button
              onClick={() => setShowCreateLeague(true)}
              style={styles.createBtn}
            >
              ➕ Criar Nova Liga
            </button>
          ) : (
            <div style={styles.createForm}>
              <input
                type="text"
                placeholder="Nome da liga"
                value={newLeagueName}
                onChange={(e) => setNewLeagueName(e.target.value)}
                style={styles.input}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreateLeague();
                }}
              />
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleCreateLeague}
                  style={styles.confirmBtn}
                >
                  Criar
                </button>
                <button
                  onClick={() => {
                    setShowCreateLeague(false);
                    setNewLeagueName("");
                  }}
                  style={styles.cancelBtn}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0e27",
    fontFamily: "sans-serif",
    color: "#fff",
  },
  header: {
    backgroundColor: "#1a1f3a",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #2a2f4a",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userEmail: {
    fontSize: "14px",
    color: "#b0b3c1",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#fff",
  },
  leaguesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  leagueCard: {
    backgroundColor: "#1a1f3a",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #2a2f4a",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  leagueName: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    color: "#fff",
  },
  leagueInfo: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    color: "#8b8d99",
  },
  openBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  emptyState: {
    backgroundColor: "#1a1f3a",
    padding: "40px 20px",
    borderRadius: "8px",
    textAlign: "center",
  },
  emptyText: {
    color: "#8b8d99",
    fontSize: "16px",
  },
  createBtn: {
    padding: "12px 24px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  createForm: {
    backgroundColor: "#1a1f3a",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px 15px",
    backgroundColor: "#0a0e27",
    color: "#fff",
    border: "1px solid #2a2f4a",
    borderRadius: "4px",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  confirmBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
