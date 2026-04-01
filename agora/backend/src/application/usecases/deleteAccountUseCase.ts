import { IUserRepository } from '../../core/repositories/userRepository.interface';

export class DeleteAccountUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: { userId: string }) {
    const { userId } = input;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(userId);
    return true;
  }
}
