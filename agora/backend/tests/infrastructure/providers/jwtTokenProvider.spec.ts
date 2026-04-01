import { describe, it, expect } from 'vitest';
import { JwtTokenProvider } from '../../../src/infrastructure/providers/jwtTokenProvider';
import { AuthPayload } from '../../../src/core/types/authPayload';

describe('JwtTokenProvider (Unit Test)', () => {
  const tokenProvider = new JwtTokenProvider();
  const validPayload: AuthPayload = {
    userId: 'any_id',
    email: 'test@example.com'
  };

  it('should generate a valid JWT token', () => {
    const token = tokenProvider.generate(validPayload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid JWT token and return the payload', () => {
    const token = tokenProvider.generate(validPayload);
    const decoded = tokenProvider.verify(token);

    expect(decoded).toMatchObject(validPayload);
  });

  it('should return null when verifying an invalid or malformed token', () => {
    const malformedToken = 'invalid.token.here';
    const decoded = tokenProvider.verify(malformedToken);

    expect(decoded).toBeNull();
  });

  it('should return null when verifying an expired or modified token', () => {
    const token = tokenProvider.generate(validPayload);
    const tamperedToken = token + 'manipulated';
    const decoded = tokenProvider.verify(tamperedToken);

    expect(decoded).toBeNull();
  });
});
