"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    try {
      // 1. Invalidate client-side Supabase session
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Client sign out error:", err);
    }

    try {
      // 2. Invalidate server-side Supabase cookies
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (err) {
      console.error("Server sign out error:", err);
    }

    // 3. Clear local state and navigate to login
    setUser(null);
    setSession(null);
    router.push("/login");
    router.refresh();
  }, [supabase, router]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: Boolean(user),
    signOut,
  };
}

