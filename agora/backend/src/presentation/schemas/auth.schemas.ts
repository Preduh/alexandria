import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters long'),
  name: z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters long')
});

export const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  password: z.string({ message: 'Password is required' })
});
