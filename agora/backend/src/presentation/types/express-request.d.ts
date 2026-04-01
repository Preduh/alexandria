import { AuthPayload } from '../../core/types/authPayload';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
