import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import { generateOpenApiDocument } from '../docs/openapi';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Swagger UI — disponível apenas em dev
if (process.env.NODE_ENV !== 'production') {
  const openApiDoc = generateOpenApiDocument();
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  app.get('/api/docs.json', (_req, res) => res.json(openApiDoc));
}

// Rota inicial pedida "hello agora"
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'hello agora' });
});

export default app;
