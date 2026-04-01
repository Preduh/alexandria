import { IUserRepository } from '../../core/repositories/userRepository.interface';
import { IHashProvider } from '../../core/providers/hashProvider.interface';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider
  ) {}

  async execute(input: RegisterInput) {
    const { email, password, name } = input;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }
}
