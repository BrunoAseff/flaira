"use client";

import ErrorPage from "@/components/pages/ErrorPage";
import LoadingPage from "@/components/pages/LoadingPage";
import useAuth from "@/hooks/use-auth";

export default function Logbook() {
  const { session, isPending, error } = useAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return <div>Logbook</div>;
}
