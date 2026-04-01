import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/presentation/app';

describe('Server Setup & Root Route', () => {
  it('deve responder com "hello agora" na rota principal /', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'hello agora' });
  });
});
