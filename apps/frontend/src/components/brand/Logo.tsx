import Image from 'next/image';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: { image: 25, text: 'text-2xl' },
  md: { image: 35, text: 'text-3xl' },
  lg: { image: 45, text: 'text-4xl' },
};

export default function Logo({ size = 'sm' }: LogoProps) {
  const { image, text } = sizeMap[size];

  return (
    <div className="flex gap-3 items-center">
      <Image width={image} height={image} src="/logo.svg" alt="Flaira logo" />
      <h1 className={`font-medium font-logo text-foreground ${text}`}>
        Flaira
      </h1>
    </div>
  );
}
