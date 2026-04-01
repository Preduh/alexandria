import bcrypt from 'bcrypt';
import { IHashProvider } from '../../core/providers/hashProvider.interface';

export class BcryptHashProvider implements IHashProvider {
  async compare(plaintext: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hashed);
  }

  async hash(plaintext: string): Promise<string> {
    const salts = 12;
    return bcrypt.hash(plaintext, salts);
  }
}
