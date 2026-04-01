'use client';

import { AuthForm } from '../../components/auth/AuthForm';
import { authService } from '../../services/authService';
import { type RegisterInput, type LoginInput } from '../../schemas/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterInput | LoginInput) => {
    const registerData = data as RegisterInput;
    await authService.register(registerData);
    
    // Sucesso no cadastro, redireciona para o login
    alert('Conta criada com sucesso! Faça login para continuar.');
    router.push('/login');
  };

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}
