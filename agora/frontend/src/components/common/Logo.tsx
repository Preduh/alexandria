import { Library } from 'lucide-react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 32, showText = true }: LogoProps) {
  return (
    <div className={styles.logoContainer}>
      <Library size={size} className={styles.icon} />
      {showText && <h1 className={styles.text}>Ágora</h1>}
    </div>
  );
}
