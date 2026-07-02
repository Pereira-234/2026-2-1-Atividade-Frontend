// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Como o localStorage não fica acessível no servidor do Next.js Middleware de forma nativa simples,
  // uma alternativa padrão em Next.js para checar autenticação no client-side/edge é ler um cookie.
  // Mas para simplificar conforme o escopo escolar usando localStorage, faremos a validação robusta 
  // direto no componente (Client Component) usando useEffect.
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};