import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    const check = async () => {
      try {
        // v2: supabase.auth.getSession()
        if ((supabase.auth as any).getSession) {
          const { data } = await (supabase.auth as any).getSession();
          setIsAuthenticated(!!data?.session);
        }
        // v1: supabase.auth.session()
        else if ((supabase.auth as any).session) {
          const session = (supabase.auth as any).session();
          setIsAuthenticated(!!session);
        }
        // fallback: tentar getUser (existe em v2 e alguns setups)
        else if ((supabase.auth as any).getUser) {
          const { data } = await (supabase.auth as any).getUser();
          setIsAuthenticated(!!data?.user);
        }
      } finally {
        setLoading(false);
      }

      // manter sync com mudanças de auth (v1/v2)
      if ((supabase.auth as any).onAuthStateChange) {
        const { data } = (supabase.auth as any).onAuthStateChange(
          (_event: any, session: any) => {
            // v2 fornece (event, session) / v1 também; tratamos genérico
            setIsAuthenticated(!!session);
          }
        );
        unsub = data ?? null;
      }
    };

    check();
    return () => unsub?.unsubscribe?.();
  }, []);

  if (loading) return null; // opcional: coloque um spinner aqui
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}
