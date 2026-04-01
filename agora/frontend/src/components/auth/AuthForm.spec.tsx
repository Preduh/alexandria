import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from './AuthForm';
import { describe, it, expect, vi } from 'vitest';

describe('AuthForm Component', () => {
  it('should render the login form correctly', () => {
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    expect(screen.getByText('Ágora')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should render the register form correctly', () => {
    render(<AuthForm mode="register" onSubmit={vi.fn()} />);

    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Tenta submeter o formulário
    const form = screen.getByLabelText('auth-form');
    fireEvent.submit(form);

    const error = await screen.findByText(/formato de e-mail inválido/i);
    expect(error).toBeInTheDocument();
  });

  it('should call onSubmit with correct data when form is valid', async () => {
    const mockOnSubmit = vi.fn();
    render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
