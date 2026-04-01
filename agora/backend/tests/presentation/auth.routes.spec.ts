import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/presentation/routes/auth.routes';

const testApp = express();
testApp.use(express.json());
testApp.use('/api/auth', authRoutes); // Injeção de Rota Limpa pra TDD real

describe('Auth API (E2E Integration)', () => {
  let accessToken: string;
  let createdUserId: string;

  it('should register a new user via POST /api/auth/register', async () => {
    const res = await request(testApp)
      .post('/api/auth/register')
      .send({
        email: 'e2e@agora-test.com',
        password: 'secure_password_test',
        name: 'E2E Tester'
      });

    expect(res.status).toBe(201); // Created
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('e2e@agora-test.com');
    // Verificando que a rota filtrou o password via UseCase
    expect(res.body).not.toHaveProperty('password');

    createdUserId = res.body.id;
  });

  it('should login and return a JWT token via POST /api/auth/login', async () => {
    const res = await request(testApp)
      .post('/api/auth/login')
      .send({
        email: 'e2e@agora-test.com',
        password: 'secure_password_test'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe('e2e@agora-test.com');

    accessToken = res.body.accessToken;
  });

  it('should return 401 Unauthorized for invalid passwords on POST /api/auth/login', async () => {
    const res = await request(testApp)
      .post('/api/auth/login')
      .send({
        email: 'e2e@agora-test.com',
        password: 'wrong_password_123'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 Unauthorized when deleting account without token', async () => {
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Access token is required');
  });

  it('should return 403 Forbidden when trying to delete another user account', async () => {
    // 1. Register and Login another user
    await request(testApp).post('/api/auth/register').send({
      email: 'intruder@test.com',
      password: 'password123',
      name: 'Intruder'
    });

    const loginRes = await request(testApp).post('/api/auth/login').send({
      email: 'intruder@test.com',
      password: 'password123'
    });

    const intruderToken = loginRes.body.accessToken;

    // 2. Try to delete the first user with the intruder's token
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`)
      .set('Authorization', `Bearer ${intruderToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'You are not authorized to delete this account');
  });

  it('should delete the account via DELETE /api/auth/account/:id with valid token', async () => {
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(204); // No Content
  });

  it('should return 400 Bad Request if registration body is empty', async () => {
    const res = await request(testApp)
      .post('/api/auth/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('should return 400 Bad Request if login body is empty', async () => {
    const res = await request(testApp)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('should return 401 Unauthorized if deleting a non-existent account without token', async () => {
    const res = await request(testApp)
      .delete('/api/auth/account/non-existent-id');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Access token is required');
  });

  it('should return 401 Unauthorized if token format is invalid', async () => {
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`)
      .set('Authorization', 'InvalidFormat Token');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token format. "Bearer <token>" is expected');
  });

  it('should return 401 Unauthorized if token is invalid or expired', async () => {
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`)
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid or expired token');
  });

  it('should return 404 Not Found if trying to delete a non-existent account with valid token', async () => {
    // 1. Criar novo usuário temporário
    const tempUser = await request(testApp).post('/api/auth/register').send({
      email: 'temp-404@test.com',
      password: 'password123',
      name: 'Temp User'
    });
    const tempUserId = tempUser.body.id;
    const loginRes = await request(testApp).post('/api/auth/login').send({
      email: 'temp-404@test.com',
      password: 'password123'
    });
    const tempToken = loginRes.body.accessToken;

    // 2. Deletar a conta (primeira vez)
    await request(testApp)
      .delete(`/api/auth/account/${tempUserId}`)
      .set('Authorization', `Bearer ${tempToken}`);

    // 3. Tentar deletar novamente (id bate, mas usuário não existe mais -> 404)
    const res = await request(testApp)
      .delete(`/api/auth/account/${tempUserId}`)
      .set('Authorization', `Bearer ${tempToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'The requested account does not exist');
  });
});

import { RegisterUseCase } from '../../src/application/usecases/registerUseCase';
import { LoginUseCase } from '../../src/application/usecases/loginUseCase';
import { DeleteAccountUseCase } from '../../src/application/usecases/deleteAccountUseCase';

describe('Auth API (Error Handling Spies)', () => {
  it('should return 400 if registerUseCase throws unexpected error', async () => {
    const spy = vi.spyOn(RegisterUseCase.prototype, 'execute').mockRejectedValueOnce(new Error('Unexpected crash'));
    
    const res = await request(testApp)
      .post('/api/auth/register')
      .send({ email: 'crash@test.com', password: 'password123', name: 'Crash' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Unexpected crash');
    spy.mockRestore();
  });

  it('should return 400 if loginUseCase throws unexpected error', async () => {
    const spy = vi.spyOn(LoginUseCase.prototype, 'execute').mockRejectedValueOnce(new Error('Unexpected login error'));
    
    const res = await request(testApp)
      .post('/api/auth/login')
      .send({ email: 'crash@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'An error occurred during login');
    spy.mockRestore();
  });

  it('should return 400 if deleteAccountUseCase throws unexpected error', async () => {
    const spy = vi.spyOn(DeleteAccountUseCase.prototype, 'execute').mockRejectedValueOnce(new Error('Database breakdown'));
    
    const { JwtTokenProvider } = await import('../../src/infrastructure/providers/jwtTokenProvider');
    const token = new JwtTokenProvider().generate({ userId: 'any', email: 'any@test.com' });

    const res = await request(testApp)
      .delete('/api/auth/account/any')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'An error occurred while deleting the account');
    spy.mockRestore();
  });

  it('should return 400 if deleteAccountUseCase throws a non-Error object', async () => {
    const spy = vi.spyOn(DeleteAccountUseCase.prototype, 'execute').mockRejectedValueOnce('Some string error');
    
    const { JwtTokenProvider } = await import('../../src/infrastructure/providers/jwtTokenProvider');
    const token = new JwtTokenProvider().generate({ userId: 'any', email: 'any@test.com' });

    const res = await request(testApp)
      .delete('/api/auth/account/any')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'An error occurred while deleting the account');
    spy.mockRestore();
  });
});
