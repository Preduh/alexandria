import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { RegisterUseCase } from '../../application/usecases/registerUseCase';
import { LoginUseCase } from '../../application/usecases/loginUseCase';
import { DeleteAccountUseCase } from '../../application/usecases/deleteAccountUseCase';
import { PrismaUserRepository } from '../../infrastructure/database/prismaUserRepository';
import { BcryptHashProvider } from '../../infrastructure/providers/bcryptHashProvider';
import { JwtTokenProvider } from '../../infrastructure/providers/jwtTokenProvider';

import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();

// Fábrica de Injeção de Dependência (Dependency Injection container root block)
const userRepository = new PrismaUserRepository();
const hashProvider = new BcryptHashProvider();
const jwtProvider = new JwtTokenProvider();

const registerUseCase = new RegisterUseCase(userRepository, hashProvider);
const loginUseCase = new LoginUseCase(userRepository, hashProvider, jwtProvider);
const deleteAccountUseCase = new DeleteAccountUseCase(userRepository);

const authController = new AuthController(registerUseCase, loginUseCase, deleteAccountUseCase);

const authenticated = authMiddleware(jwtProvider);

authRoutes.post('/register', (req, res) => authController.register(req, res));
authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.delete('/account/:id', authenticated, (req, res) => authController.deleteAccount(req, res));

export default authRoutes;
