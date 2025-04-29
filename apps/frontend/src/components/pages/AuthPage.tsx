import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ProgressiveBlur } from "../ui/progressive-blur";

export default function AuthPage() {
  return (
    <main className="w-full h-dvh flex">
      <div className="w-1/2 relative md:block hidden">
        <Image
          className="object-cover"
          src="/sign-in.png"
          fill
          alt="A old map, old coins and a old compass on top of a wooden table"
          priority
        />
        <ProgressiveBlur
          direction="top"
          className="pointer-events-none absolute top-0 left-0 h-[70%] w-full"
          blurIntensity={1}
        />
        <div className="relative top-6 left-6 text-background">
          <h1 className="text-2xl">Flaira</h1>
          <p>The best platform for tracking your trips</p>
        </div>
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center md:mx-16 gap-6">
        <div className="w-[85%] md:w-[32rem] bg-background  p-6 rounded-2xl flex flex-col gap-6">
          <h1 className="text-left mr-auto font-medium text-xl mb-6">
            Sign in to Flaira
          </h1>
          <div className="flex flex-col mb-3 gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
          </div>
          <div className="flex flex-col mb-3 gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <Button>Sign in</Button>
        </div>
        <Image
          className="object-cover md:hidden absolute z-[-99]"
          src="/sign-in.png"
          fill
          alt="A old map, old coins and a old compass on top of a wooden table"
          priority
        />
      </div>
    </main>
  );
}
