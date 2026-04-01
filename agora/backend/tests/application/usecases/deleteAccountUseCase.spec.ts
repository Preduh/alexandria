import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ignoramos temporariamente o erro do typescript porque a classe ainda não existe (TDD estrito).
import { DeleteAccountUseCase } from '../../../src/application/usecases/deleteAccountUseCase';

describe('DeleteAccountUseCase', () => {
  let deleteAccountUseCase: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    };

    deleteAccountUseCase = new DeleteAccountUseCase(mockUserRepository);
  });

  it('should delete a user completely if the targeted user exists', async () => {


    // Arrange
    const targetUserId = 'target_uuid_here';
    mockUserRepository.findById.mockResolvedValue({ id: targetUserId, email: 'john@doe.com' });
    mockUserRepository.delete.mockResolvedValue(true);

    // Act
    await deleteAccountUseCase.execute({ userId: targetUserId });

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(targetUserId);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(targetUserId);
  });

  it('should throw an error when trying to delete a non-existent user', async () => {


    // Arrange
    const invalidId = 'non_existent_id';
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(deleteAccountUseCase.execute({ userId: invalidId })).rejects.toThrow('User not found');

    // A exclusão de banco nunca pode ser disparada se a entidade fantasma for fornecida
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
