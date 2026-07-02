// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nome da Sua Aplicação",
  description: "Prova de Programação Orientada a Serviços",
  icons: {
    icon: "/favicon.ico", // Se quiser mudar o ícone, mude o arquivo na pasta public ou passe um link
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}