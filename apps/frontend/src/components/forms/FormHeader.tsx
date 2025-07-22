import { CardHeader, CardTitle } from '../ui/card';
import Logo from '../brand/Logo';

interface FormHeaderProps {
  title: string;
  hasLogo: boolean;
}

export function FormHeader({ title, hasLogo }: FormHeaderProps) {
  return (
    <CardHeader>
      {hasLogo && <Logo size="md" />}
      <CardTitle className="text-left mr-auto font-semibold text-foreground text-xl mt-1 md:mt-3">
        {title}
      </CardTitle>
    </CardHeader>
  );
}
