import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { describe, it, expect, vi } from 'vitest';

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ThemeToggle Component', () => {
  it('should render the toggle button and its icons', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Deve encontrar o botão pelo aria-label que vamos adicionar
    const button = screen.getByLabelText(/alternar tema/i);
    expect(button).toBeInTheDocument();
  });

  it('should toggle theme when clicked', () => {
    // Espiona o método toggleTheme se necessário, mas testar o comportamento visual/estado é melhor
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByLabelText(/alternar tema/i);
    
    // Inicia no light (padrão)
    expect(window.document.documentElement.classList.contains('dark')).toBe(false);

    // Clica para mudar para dark
    fireEvent.click(button);
    expect(window.document.documentElement.classList.contains('dark')).toBe(true);

    // Clica novamente para voltar para light
    fireEvent.click(button);
    expect(window.document.documentElement.classList.contains('dark')).toBe(false);
  });
});
