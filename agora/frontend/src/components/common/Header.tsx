import Link from 'next/link';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="h-16 w-full flex items-center justify-between px-8 bg-glass-bg border-b border-glass-border backdrop-blur-xl sticky top-0 z-50">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Logo size={28} />
      </Link>
      <div className="flex items-center gap-6">
        <Link 
          href="/login" 
          className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors duration-200"
        >
          Entrar
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
