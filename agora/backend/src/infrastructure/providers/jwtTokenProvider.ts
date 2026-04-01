import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { ITokenProvider } from '../../core/providers/tokenProvider.interface';

// Default value only for safety during initial setup if not provided in .env
const SECRET = process.env.JWT_SECRET || 'your_secret_here';

import { AuthPayload } from '../../core/types/authPayload';

export class JwtTokenProvider implements ITokenProvider {
  generate(payload: AuthPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' }); // validade ideal pra uso de App local (7 dias de cache)
  }

  verify(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, SECRET) as AuthPayload;
    } catch {
      return null;
    }
  }
}
