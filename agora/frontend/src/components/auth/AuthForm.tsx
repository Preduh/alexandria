import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../../schemas/auth';
import { Logo } from '../common/Logo';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: LoginInput | RegisterInput) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = mode === 'login' ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
  });

  const handleFormSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[calc(100vh-64px)] p-6">
      <form 
        className="w-full max-w-[440px] bg-card-bg backdrop-blur-2xl border border-card-border rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col" 
        onSubmit={handleSubmit(handleFormSubmit)} 
        aria-label="auth-form"
      >
        <div className="mb-6">
          <Logo size={48} />
        </div>
        
        <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center tracking-tight">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-base text-secondary mb-10 text-center leading-relaxed">
          {mode === 'login'
            ? 'Continue sua jornada de estudos no Alexandria.'
            : 'Junte-se à comunidade e organize seus estudos.'}
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-error p-3 mb-6 text-red-800 dark:text-red-400 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground/80 ml-1">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                {...register('name')}
                className={`px-5 py-3.5 rounded-xl border-2 bg-background text-foreground text-base focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow ${
                  errors.name ? 'border-error ring-error/10' : 'border-card-border focus:border-primary'
                }`}
              />
              {errors.name && <span className="text-xs text-error font-medium ml-1">{errors.name.message as string}</span>}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground/80 ml-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={`px-5 py-3.5 rounded-xl border-2 bg-background text-foreground text-base focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow ${
                errors.email ? 'border-error ring-error/10' : 'border-card-border focus:border-primary'
              }`}
            />
            {errors.email && <span className="text-xs text-error font-medium ml-1">{errors.email.message as string}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-foreground/80 ml-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`px-5 py-3.5 rounded-xl border-2 bg-background text-foreground text-base focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow ${
                errors.password ? 'border-error ring-error/10' : 'border-card-border focus:border-primary'
              }`}
            />
            {errors.password && <span className="text-xs text-error font-medium ml-1">{errors.password.message as string}</span>}
          </div>
        </div>

        <button 
          type="submit" 
          className="mt-8 bg-primary text-white py-4 px-6 rounded-xl text-base font-bold shadow-lg hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          disabled={loading}
        >
          {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

        <div className="mt-8 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-secondary">
              Não tem uma conta? <a href="/register" className="text-primary font-bold hover:underline">Cadastre-se</a>
            </p>
          ) : (
            <p className="text-sm text-secondary">
              Já possui uma conta? <a href="/login" className="text-primary font-bold hover:underline">Entre aqui</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
