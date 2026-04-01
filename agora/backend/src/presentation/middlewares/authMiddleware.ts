import { Request, Response, NextFunction } from 'express';
import { ITokenProvider } from '../../core/providers/tokenProvider.interface';
import { sendError } from '../utils/httpResponse';

export const authMiddleware = (tokenProvider: ITokenProvider) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 401, 'Access token is required');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return sendError(res, 401, 'Invalid token format. "Bearer <token>" is expected');
    }

    const token = parts[1];
    const decoded = tokenProvider.verify(token);

    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired token');
    }

    // Armazena o payload (que contém o userId) para uso posterior nos controllers
    req.user = decoded;

    next();
  };
};
