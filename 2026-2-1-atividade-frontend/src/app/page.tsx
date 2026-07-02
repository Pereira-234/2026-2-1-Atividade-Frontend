// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 text-zinc-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Afonso Paiva de Aquino</h1>
        <p className="text-muted-foreground text-lg">Prova de Programação Orientada a Serviços</p>
        
        <div className="pt-4">
          <Link 
            href="/auth" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    </main>
  );
}