import Image from "next/image";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <h1 className="text-2xl font-semibold">Flaira</h1>
          <p className="font-medium text-muted">
            The best platform for tracking your trips
          </p>
        </div>
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center md:mx-16 gap-6">
        {children}
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
