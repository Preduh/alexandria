import { AuthPayload } from '../types/authPayload';

export interface ITokenProvider {
  generate(payload: AuthPayload): string;
  verify(token: string): AuthPayload | null;
}
