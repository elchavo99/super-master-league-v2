import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase, getCurrentUser, getLeagues, signOut } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser(currentUser);

    const { data, error } = await getLeagues(currentUser.id);

    if (error) {
      console.error(error);
    } else {
      setLeagues(data || []);
    }

    setLoading(false);
  }

  async function handleCreateLeague() {
    if (!newLeagueName.trim()) {
      alert("Digite um nome para a liga.");
      return;
    }

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

    setLeagues([...(leagues || []), data[0]]);
    setNewLeagueName("");
  }

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  if (loading) {
    return <main style={styles.container}>Carregando...</main>;
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Super Master League v2</h1>
          <p style={styles.subtitle}>{user?.email}</p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section style={styles.content}>
        <h2>Minhas Ligas</h2>

        <div style={styles.form}>
          <input
            style={styles.input}
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            placeholder="Nome da liga"
          />
          <button style={styles.createButton} onClick={handleCreateLeague}>
            Criar Liga
          </button>
        </div>

        {leagues.length === 0 ? (
          <p style={styles.empty}>Nenhuma liga criada ainda.</p>
        ) : (
          <div style={styles.grid}>
            {leagues.map((league) => (
              <article
                key={league.id}
                style={styles.card}
                onClick={() => router.push(`/league/${league.id}`)}
              >
                <h3>{league.name}</h3>
                <p>Season: {league.season}</p>
                <p>Status: {league.status}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#b0b3c1",
  },
  logoutButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#ff4444",
    color: "#fff",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #2a2f4a",
    background: "#11162f",
    color: "#fff",
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
  empty: {
    color: "#b0b3c1",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#1a1f3a",
    border: "1px solid #2a2f4a",
    borderRadius: "8px",
    padding: "20px",
    cursor: "pointer",
  },
};
