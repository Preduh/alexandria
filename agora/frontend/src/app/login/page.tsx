'use client';

import { AuthForm } from '../../components/auth/AuthForm';
import { authService } from '../../services/authService';
import { type LoginInput, type RegisterInput } from '../../schemas/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginInput | RegisterInput) => {
    const loginData = data as LoginInput;
    const result = await authService.login(loginData);
    
    // Armazena o token (em produção, cookie httpOnly é melhor, mas para MVP local o localStorage funciona)
    localStorage.setItem('@Alexandria:token', result.accessToken);
    localStorage.setItem('@Alexandria:user', JSON.stringify(result.user));

    // Redireciona para a home ou dashboard
    router.push('/');
  };

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
