import { IUserRepository } from '../../core/repositories/userRepository.interface';
import { IHashProvider } from '../../core/providers/hashProvider.interface';
import { ITokenProvider } from '../../core/providers/tokenProvider.interface';

interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(input: LoginInput) {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordMatch = await this.hashProvider.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.tokenProvider.generate({
      userId: user.id,
      email: user.email,
    });

    // Segurança: eliminamos a hash da memória do objeto exposto
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }
}
