import { Request, Response, NextFunction } from 'express';
import { ITokenProvider } from '../../core/providers/tokenProvider.interface';
import { sendError } from '../utils/httpResponse';

export const authMiddleware = (tokenProvider: ITokenProvider) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 401, 'Unauthorized');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return sendError(res, 401, 'Unauthorized');
    }

    const token = parts[1];
    const decoded = tokenProvider.verify(token);

    if (!decoded) {
      return sendError(res, 401, 'Unauthorized');
    }

    // Armazena o payload (que contém o userId) para uso posterior nos controllers
    (req as any).user = decoded;

    next();
  };
};
