"use client";

import { auth } from "@/auth/client";
import SignUp from "@/components/SignUp";

export default function Home() {
  const { data: session, isPending, error } = auth.useSession();

  if (isPending) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;
  if (!session) return <SignUp />;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-semibold">Logado</h1>
      </main>
    </div>
  );
}
