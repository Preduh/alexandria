import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do useRouter do Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock do fetch global se necessário
global.fetch = vi.fn();
