import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/usecases/registerUseCase';
import { LoginUseCase } from '../../application/usecases/loginUseCase';
import { DeleteAccountUseCase } from '../../application/usecases/deleteAccountUseCase';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';
import { sendError } from '../utils/httpResponse';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(
          res,
          400,
          'Validation failed',
          validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        );
      }

      const user = await this.registerUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Registration failed';
      if (message === 'Email already in use') {
        sendError(res, 409, message);
      } else {
        sendError(res, 400, message);
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(
          res,
          400,
          'Validation failed',
          validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        );
      }

      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login failed';
      if (message === 'Invalid credentials') {
        sendError(res, 401, 'Invalid email or password');
      } else {
        sendError(res, 400, 'An error occurred during login');
      }
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const authenticatedUserId = req.user?.userId;

      if (authenticatedUserId !== id) {
        return sendError(res, 403, 'You are not authorized to delete this account');
      }

      await this.deleteAccountUseCase.execute({ userId: id });
      res.status(204).send();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '';
      if (message === 'User not found') {
        sendError(res, 404, 'The requested account does not exist');
      } else {
        sendError(res, 400, 'An error occurred while deleting the account');
      }
    }
  }
}
