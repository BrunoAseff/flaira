import ErrorPage from "@/components/pages/ErrorPage";
import LoadingPage from "@/components/pages/LoadingPage";
import UseAuth from "@/hooks/use-auth";

export default function Trips() {
  const { session, isPending, error } = UseAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return <div>Trips</div>;
}
