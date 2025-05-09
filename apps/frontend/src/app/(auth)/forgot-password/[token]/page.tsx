import ResetPassword from "@/components/pages/ResetPassword";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <ResetPassword token={token} />;
}
