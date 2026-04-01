import { Library } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 32, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3 justify-center select-none">
      <Library 
        size={size} 
        className="text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all" 
      />
      {showText && (
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight">
          Ágora
        </h1>
      )}
    </div>
  );
}
