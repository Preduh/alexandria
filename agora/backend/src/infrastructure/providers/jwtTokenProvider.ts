import jwt from 'jsonwebtoken';
import { ITokenProvider } from '../../core/providers/tokenProvider.interface';

// Resgate da chave de ambiente do servidor, com fail-safe apenas pra Dev/TDD
const SECRET = process.env.JWT_SECRET || 'agora_fallback_secret_development';

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
