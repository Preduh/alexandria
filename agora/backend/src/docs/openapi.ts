import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { authRegistry } from './auth.docs';

// Instância global do Registry OpenAPI
export const registry = new OpenAPIRegistry([authRegistry]);

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Ágora API',
      version: '1.0.0',
      description:
        'API REST do módulo Ágora — sistema de gerenciamento de tempo de estudo, conteúdo e cronograma da plataforma Alexandria.',
      contact: {
        name: 'Alexandria',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Servidor de Desenvolvimento Local',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Registro, autenticação e gerenciamento de conta',
      },
    ],
  });
}
