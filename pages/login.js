/**
 * Página de Login
 * Usuário faz login com Google aqui
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se já está logado
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        alert("Erro ao fazer login: " + error.message);
      }
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>🏀 Super Master League v2</h1>
        <p style={styles.subtitle}>Fantasy NBA Para Você e Seus Amigos</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Carregando..." : "Login com Google"}
        </button>

        <p style={styles.info}>
          ℹ️ Use sua conta Google para entrar e começar a criar sua liga!
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0a0e27",
    fontFamily: "sans-serif",
  },
  box: {
    textAlign: "center",
    backgroundColor: "#1a1f3a",
    padding: "60px 40px",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    color: "#fff",
    fontSize: "36px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#b0b3c1",
    fontSize: "16px",
    marginBottom: "40px",
  },
  button: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  info: {
    color: "#8b8d99",
    fontSize: "14px",
    marginTop: "20px",
  },
};
