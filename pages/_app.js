/**
 * Arquivo raiz da aplicação Next.js
 * Aqui carrega as configurações globais
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Verifica autenticação em cada página
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Se não está logado e não está na página de login, redireciona
      if (!user && router.pathname !== "/login") {
        router.push("/login");
      }
    };

    checkAuth();

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && router.pathname !== "/login") {
        router.push("/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
