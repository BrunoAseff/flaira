import { auth } from '@/auth/client';
import EmailConfirmed from '@/components/pages/EmailConfirmed';

export default async function EmailConfirmedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let isVerified = false;

  if (token) {
    await auth.verifyEmail({
      query: {
        token,
      },
    });
    isVerified = true;
  }

  return <EmailConfirmed isVerified={isVerified} />;
}
