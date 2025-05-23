"use client";

import { auth } from "@/auth/client";
import ErrorPage from "@/components/pages/ErrorPage";
import LoadingPage from "@/components/pages/LoadingPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isPending, error } = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-5">
      <main className="flex flex-col gap-[32px] w-full">Content</main>
    </div>
  );
}
