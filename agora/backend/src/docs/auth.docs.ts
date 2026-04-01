import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const authRegistry = new OpenAPIRegistry();

// ── Schemas ──────────────────────────────────────────────────────────────────

export const RegisterBodySchema = authRegistry.register(
  'RegisterBody',
  z.object({
    email: z.string().email().openapi({ example: 'user@agora.com' }),
    password: z.string().min(8).openapi({ example: 'securepassword123' }),
    name: z.string().min(2).openapi({ example: 'John Doe' }),
  })
);

export const LoginBodySchema = authRegistry.register(
  'LoginBody',
  z.object({
    email: z.string().email().openapi({ example: 'user@agora.com' }),
    password: z.string().min(1).openapi({ example: 'securepassword123' }),
  })
);

export const UserResponseSchema = authRegistry.register(
  'UserResponse',
  z.object({
    id: z.string().uuid().openapi({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    email: z.string().email().openapi({ example: 'user@agora.com' }),
    name: z.string().openapi({ example: 'John Doe' }),
    createdAt: z.string().datetime().openapi({ example: '2026-04-01T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2026-04-01T00:00:00.000Z' }),
  })
);

export const LoginResponseSchema = authRegistry.register(
  'LoginResponse',
  z.object({
    accessToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    user: UserResponseSchema,
  })
);

export const ErrorResponseSchema = authRegistry.register(
  'ErrorResponse',
  z.object({
    message: z.string().openapi({ description: 'Human readable error summary' }),
    errors: z.array(z.object({
      field: z.string(),
      message: z.string()
    })).optional().openapi({ example: [{ field: 'email', message: 'Invalid format' }] }),
  })
);

// ── Routes ───────────────────────────────────────────────────────────────────

authRegistry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  description: 'Creates a new user account with email, password and name. Returns the created user without the password hash.',
  request: {
    body: {
      content: { 'application/json': { schema: RegisterBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: { 'application/json': { schema: UserResponseSchema } },
    },
    409: {
      description: 'Email already in use',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

authRegistry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Authenticate a user',
  description: 'Validates email and password, returning a signed JWT access token valid for 7 days.',
  request: {
    body: {
      content: { 'application/json': { schema: LoginBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: LoginResponseSchema } },
    },
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: ErrorResponseSchema, example: { message: 'Invalid email or password' } } },
    },
  },
});

authRegistry.registerPath({
  method: 'delete',
  path: '/api/auth/account/{id}',
  tags: ['Auth'],
  summary: 'Delete an account',
  description: 'Permanently removes a user account from the system. This action is irreversible.',
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: 'The unique user ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    }),
  },
  responses: {
    204: {
      description: 'Account deleted successfully',
    },
    401: {
      description: 'Access token is required',
      content: { 'application/json': { schema: ErrorResponseSchema, example: { message: 'Access token is required' } } },
    },
    403: {
      description: 'You are not authorized to delete this account',
      content: { 'application/json': { schema: ErrorResponseSchema, example: { message: 'You are not authorized to delete this account' } } },
    },
    404: {
      description: 'The requested account does not exist',
      content: { 'application/json': { schema: ErrorResponseSchema, example: { message: 'The requested account does not exist' } } },
    },
  },
  security: [{ BearerAuth: [] }],
});
