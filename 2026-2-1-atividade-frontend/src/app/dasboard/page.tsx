// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  
  // Estados do Formulário
  const [quoteText, setQuoteText] = useState("");
  const [authorText, setAuthorText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // 1. Verificar se o usuário está conectado
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  // 2. Carregar os Quotes da API DummyJSON
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch("https://dummyjson.com/quotes?limit=5");
        const data = await res.json();
        setQuotes(data.quotes);
        
        // Guardar autores únicos inicialmente
        const initialAuthors = data.quotes.map((q: Quote) => q.author);
        const uniqueAuthors = Array.from(new Set(initialAuthors)) as string[];
        setAuthors(uniqueAuthors);
        localStorage.setItem("local_authors", JSON.stringify(uniqueAuthors));
      } catch (err) {
        console.error("Erro ao carregar frases:", err);
      }
    };
    fetchQuotes();
  }, []);

  // 3. Validação e Submissão do Formulário (Criar / Atualizar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verificação / Validação de frase e autor
    if (!quoteText.trim() || !authorText.trim()) {
      setError("Ambos os campos (frase e autor) são obrigatórios.");
      return;
    }

    if (editingId !== null) {
      // Modo Edição (Update)
      setQuotes(prev => prev.map(q => q.id === editingId ? { ...q, quote: quoteText, author: authorText } : q));
      setEditingId(null);
    } else {
      // Modo Criação (Create)
      const newQuote: Quote = {
        id: Date.now(), // ID temporário único
        quote: quoteText,
        author: authorText
      };
      setQuotes(prev => [newQuote, ...prev]);
    }

    // Armazenar localmente o novo autor se ele não existir na lista
    if (!authors.includes(authorText.trim())) {
      const updatedAuthors = [...authors, authorText.trim()];
      setAuthors(updatedAuthors);
      localStorage.setItem("local_authors", JSON.stringify(updatedAuthors));
    }

    // Limpar campos
    setQuoteText("");
    setAuthorText("");
  };

  // 4. Preparar campos para Edição
  const handleEdit = (quote: Quote) => {
    setEditingId(quote.id);
    setQuoteText(quote.quote);
    setAuthorText(quote.author);
  };

  // 5. Apagar Registro (Delete)
  const handleDelete = (id: number) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setQuoteText("");
      setAuthorText("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-10 text-zinc-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Frases</h1>
            <p className="text-muted-foreground text-sm">Gerencie citações famosas</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulário CRUD */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>{editingId !== null ? "Editar Frase" : "Nova Frase"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Frase</label>
                  <Textarea 
                    placeholder="Digite a citação célebre..."
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Autor</label>
                  <Input 
                    placeholder="Nome do autor"
                    value={authorText}
                    onChange={(e) => setAuthorText(e.target.value)}
                    list="authors-list"
                  />
                  {/* Datalist usando os autores armazenados localmente para facilitar digitação */}
                  <datalist id="authors-list">
                    {authors.map((auth, index) => (
                      <option key={index} value={auth} />
                    ))}
                  </datalist>
                </div>

                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                <div className="flex gap-2">
                  <Button type="submit" className="w-full">
                    {editingId !== null ? "Salvar Alterações" : "Adicionar"}
                  </Button>
                  {editingId !== null && (
                    <Button type="button" variant="ghost" onClick={() => {
                      setEditingId(null);
                      setQuoteText("");
                      setAuthorText("");
                    }}>Cancelar</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tabela de Listagem */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Citações Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Frase</TableHead>
                    <TableHead className="w-[150px]">Autor</TableHead>
                    <TableHead className="w-[140px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Nenhuma frase encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotes.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium italic">"{q.quote}"</TableCell>
                        <TableCell>{q.author}</TableCell>
                        <TableCell className="text-right space-x-1 whitespace-nowrap">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
                            Apagar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}