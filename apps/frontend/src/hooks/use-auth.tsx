"use client";

import { auth } from "@/auth/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UseAuth() {
  const { data: session, isPending, error } = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  return { session, isPending, error };
}
