'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '../../schemas/auth';
import styles from '../../styles/components/AuthForm.module.css';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = mode === 'login' ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <h2 className={styles.title}>
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className={styles.subtitle}>
          {mode === 'login'
            ? 'Continue sua jornada de estudos no Alexandria.'
            : 'Junte-se à comunidade e organize seus estudos.'}
        </p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {mode === 'register' && (
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              placeholder="Ex: João Silva"
              {...register('name')}
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name.message as string}</span>}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register('email')}
            className={errors.email ? styles.inputError : ''}
          />
          {errors.email && <span className={styles.errorText}>{errors.email.message as string}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && <span className={styles.errorText}>{errors.password.message as string}</span>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

        <div className={styles.footer}>
          {mode === 'login' ? (
            <p>
              Não tem uma conta? <a href="/register">Cadastre-se</a>
            </p>
          ) : (
            <p>
              Já possui uma conta? <a href="/login">Entre aqui</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
