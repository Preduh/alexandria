import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ignoramos temporariamente o erro do typescript porque a classe ainda não existe (TDD estrito).
import { LoginUseCase } from '../../../src/application/usecases/loginUseCase';

describe('LoginUseCase', () => {
  let loginUseCase: any;
  let mockUserRepository: any;
  let mockHashProvider: any;
  let mockTokenProvider: any;

  beforeEach(() => {
    // 1. Mock do repositório (abstraindo o banco de dados via Clean Architecture)
    mockUserRepository = {
      findByEmail: vi.fn(),
    };

    // 2. Mock do provedor de Criptografia (ex: Bcrypt)
    mockHashProvider = {
      compare: vi.fn(),
    };

    // 3. Mock do provedor de JWT
    mockTokenProvider = {
      generate: vi.fn(),
    };

    // O UseCase de aplicação na Clean Architecture não conhece o Prisma nem o Express, 
    // apenas interfaces injetadas.
    loginUseCase = new LoginUseCase(
      mockUserRepository,
      mockHashProvider,
      mockTokenProvider
    );
  });

  it('should authenticate a user and return a JWT token when credentials are valid', async () => {


    // Arrange
    const validUser = {
      id: 'any_uuid',
      email: 'john@doe.com',
      password: 'hashed_password_from_db',
    };

    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockHashProvider.compare.mockResolvedValue(true);
    mockTokenProvider.generate.mockReturnValue('valid_jwt_token');

    // Act
    const result = await loginUseCase.execute({
      email: 'john@doe.com',
      password: 'valid_password',
    });

    // Assert a lógica que o UseCase FEZ internamente
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@doe.com');
    expect(mockHashProvider.compare).toHaveBeenCalledWith('valid_password', 'hashed_password_from_db');
    // Payload do JWT no padrão
    expect(mockTokenProvider.generate).toHaveBeenCalledWith({ userId: 'any_uuid' });
    
    // Assert a resposta do UseCase
    expect(result).toHaveProperty('accessToken', 'valid_jwt_token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('john@doe.com');
    expect(result.user).not.toHaveProperty('password'); // Por segurança nunca retornar a Hash
  });

  it('should throw an error when the user email is not found', async () => {


    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(loginUseCase.execute({
      email: 'invalid@doe.com',
      password: 'any_password',
    })).rejects.toThrow('Invalid credentials');
    
    // Garantir que não tentou gerar token
    expect(mockTokenProvider.generate).not.toHaveBeenCalled();
  });

  it('should throw an error when the password is incorrect for an existing email', async () => {


    // Arrange
    const validUser = {
      id: 'any_uuid',
      email: 'john@doe.com',
      password: 'hashed_password_from_db',
    };

    mockUserRepository.findByEmail.mockResolvedValue(validUser);
    mockHashProvider.compare.mockResolvedValue(false); // Simulando a falha do hash match

    // Act & Assert
    await expect(loginUseCase.execute({
      email: 'john@doe.com',
      password: 'wrong_password',
    })).rejects.toThrow('Invalid credentials');
    
    // Garantir rigorosamente que a geração de token (login) nunca foi engatilhada
    expect(mockTokenProvider.generate).not.toHaveBeenCalled();
  });
});
