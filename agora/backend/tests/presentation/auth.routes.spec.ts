import { describe, it, expect, beforeAll, afterAll } from 'vitest';
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
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should return 401 Unauthorized when deleting account without token', async () => {
    const res = await request(testApp)
      .delete(`/api/auth/account/${createdUserId}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
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
    expect(res.body).toHaveProperty('message', 'Forbidden');
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

  it('should return 404 Not Found if deleting a non-existent account', async () => {
    const res = await request(testApp)
      .delete('/api/auth/account/non-existent-id');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
