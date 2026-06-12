import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert("Erro ao fazer login: " + error.message);
      setLoading(false);
    }
  }

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Super Master League v2</h1>
        <p style={styles.subtitle}>Fantasy NBA para você e seus amigos</p>

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? "Carregando..." : "Entrar com Google"}
        </button>

        <p style={styles.note}>
          Use sua conta Google para entrar e começar a criar sua liga.
        </p>
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0e27",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#1a1f3a",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#b0b3c1",
    marginBottom: "30px",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "#1f6feb",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  note: {
    marginTop: "20px",
    color: "#8b8d99",
    fontSize: "14px",
  },
};
