"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function login() {
    const { error } =
      await supabaseAuth.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">
          GN Essentials
        </h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <Button
          className="w-full"
          onClick={login}
        >
          Login
        </Button>
      </div>
    </main>
  );
}