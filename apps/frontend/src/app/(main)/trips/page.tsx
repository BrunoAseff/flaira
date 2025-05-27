import { auth } from "@/auth/client";
import ErrorPage from "@/components/pages/ErrorPage";
import LoadingPage from "@/components/pages/LoadingPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Trips() {
  const { data: session, isPending, error } = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return <div>Trips</div>;
}
