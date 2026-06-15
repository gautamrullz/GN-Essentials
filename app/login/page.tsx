"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseAuth } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { LoadingButton } from "@/components/ui/loading-button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    }

    void checkSession();
  }, [router]);

  async function login() {
    try {
      setLoading(true);

      const { error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">GN Essentials</h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LoadingButton
          loading={loading}
          loadingText="Signing In..."
          onClick={login}
          className="w-full"
        >
          Sign In
        </LoadingButton>
      </div>
    </main>
  );
}
