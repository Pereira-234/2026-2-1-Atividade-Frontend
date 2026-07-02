// src/app/auth/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação básica se os campos estão preenchidos
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      // Chamada para a API dummyjson
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username, // Exemplo de usuário válido na API: 'emilys'
          password: password, // Senha válida na API: 'emilyspass'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Usuário ou senha inválidos.");
      }

      // Armazenar localmente os dados do usuário (passo requisitado)
      localStorage.setItem("user_token", data.accessToken);
      localStorage.setItem("user_data", JSON.stringify(data));

      // Redirecionar para a rota solicitada (/dasboard - conforme escrito na imagem)
      router.push("/dasboard");
      
    } catch (err: any) {
      setError(err.message || "Erro ao tentar autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Login</h2>
          <p className="text-sm text-muted-foreground">Entre com seu apelido e senha</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="username">Apelido (Username)</label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu apelido"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}