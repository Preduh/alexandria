'use client';

import { AuthForm } from '../../components/auth/AuthForm';
import { authService } from '../../services/authService';
import { RegisterInput } from '../../schemas/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegisterInput) => {
    await authService.register(data);
    
    // Sucesso no cadastro, redireciona para o login
    alert('Conta criada com sucesso! Faça login para continuar.');
    router.push('/login');
  };

  return (
    <main>
      <AuthForm mode="register" onSubmit={handleRegister} />
    </main>
  );
}
