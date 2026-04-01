import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ignoramos temporariamente o erro do typescript porque a classe ainda não existe (TDD estrito).
import { RegisterUseCase } from '../../../src/application/usecases/registerUseCase';

describe('RegisterUseCase', () => {
  let registerUseCase: any;
  let mockUserRepository: any;
  let mockHashProvider: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    mockHashProvider = {
      hash: vi.fn(),
    };

    registerUseCase = new RegisterUseCase(
      mockUserRepository,
      mockHashProvider
    );
  });

  it('should create a new user and hash the password correctly', async () => {


    const input = {
      email: 'new@doe.com',
      password: 'plain_password',
      name: 'John Doe',
    };

    // Arrange: Retorna vazio ao procurar e-mail
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockHashProvider.hash.mockResolvedValue('hashed_password');
    mockUserRepository.create.mockResolvedValue({
      id: 'generated_id',
      email: 'new@doe.com',
      name: 'John Doe',
      password: 'hashed_password', // Repositório devolve com hash interna na prática
    });

    // Act
    const result = await registerUseCase.execute(input);

    // Assert: O que o Use Case deve executar
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('new@doe.com');
    expect(mockHashProvider.hash).toHaveBeenCalledWith('plain_password');
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: 'new@doe.com',
      password: 'hashed_password',
      name: 'John Doe',
    });

    // Segurança: a entidade retornada pro presentation NUNCA pode ter a senha
    expect(result).toHaveProperty('id');
    expect(result.email).toBe('new@doe.com');
    expect(result.name).toBe('John Doe');
    expect(result).not.toHaveProperty('password');
  });

  it('should throw an error if the email is already in use', async () => {


    const input = {
      email: 'existing@doe.com',
      password: 'plain_password',
      name: 'John Doe',
    };

    // Arrange: Retorna que já achou no banco
    mockUserRepository.findByEmail.mockResolvedValue({ id: 'any_id', email: 'existing@doe.com' });

    // Act & Assert
    await expect(registerUseCase.execute(input)).rejects.toThrow('Email already in use');

    // A operação deve ter sido abortada antes do processamento pesado e criação
    expect(mockHashProvider.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
