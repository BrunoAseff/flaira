import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Eye, KeyRound, Mail } from "lucide-react";

export default function SignIn() {
  return (
    <div className="w-[85%] md:w-[32rem] bg-background p-6 rounded-2xl flex flex-col gap-6">
      <h1 className="text-left mr-auto font-medium text-xl mb-6">
        Sign in to Flaira
      </h1>
      <div className="flex flex-col mb-3 gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          iconLeft={<Mail className="text-accent" />}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col mb-3 gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          iconLeft={<KeyRound className="text-accent" />}
          iconRight={<Eye className="text-accent" />}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <Link
          className="text-sm text-blue-700 hover:underline hover:text-blue-600 transition-all duration-300 font-light"
          href={"/forgot-password"}
        >
          Forgot my password
        </Link>
      </div>

      <Button>Sign in</Button>
    </div>
  );
}
