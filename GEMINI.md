# Alexandria

Aplicação monólito de uso pessoal com objetivo de gerenciar conhecimento, tarefas e projetos.

> **⚠️ Atenção, IA (Instrução Crítica)** 
> Antes de executar qualquer tarefa, planejar soluções, escrever código ou alterar configurações neste repositório, você **DEVE, obrigatoriamente, ler este arquivo (`GEMINI.md`) na íntegra**. Use isso como base única da verdade para a arquitetura e premissas do projeto.

---

## Módulo: Ágora
**O que é**: Nome referente à ágora grega, é uma aplicação de gerenciamento de tempo de estudo, conteúdo e cronograma.

### Princípios de Desenvolvimento
1. **Test-Driven Development (TDD) Estrito**:
   - O módulo da Ágora **será obrigatoriamente desenvolvido usando TDD**.
   - Toda *feature* ou alteração de código só será implementada após existir um teste para ela (que inicialmenter deve falhar). A ordem de execução na prática é rigorosamente: **Criar o Teste da Feature > Implementar a Feature**.

2. **Clean Architecture (Arquitetura Limpa)**:
   - Todo o sistema da Ágora é embasado integralmente no modelo de Clean Architecture, focando no isolamento das Regras de Negócio (Domínio e Casos de Uso) do Framework e Banco de Dados.
   - O desenvolvimento deve sempre respeitar a Inversão de Dependência, mantendo o Core (`domain` e `application/usecases`) alienado das camadas de `infrastructure` e `presentation`.

3. **Idioma e Nomenclatura**:
   - O código-fonte estrutural (variáveis, arquivos, classes, métodos e endpoints) deve ser **escrito exclusivamente em Inglês**.
   - É mandatório o uso da formatação `camelCase` para funções e variáveis por todo o projeto.

4. **Manutenção obrigatória deste arquivo (`GEMINI.md`)**:
   - **Qualquer alteração na estrutura de pastas** do projeto deve ser imediatamente refletida na seção `Estrutura de Diretórios` deste arquivo. Nunca deixe a documentação estrutural defasada.
   - **Qualquer nova feature ou endpoint HTTP** adicionado ao sistema deve ser acompanhado de documentação Swagger correspondente no arquivo `src/docs/<dominio>.docs.ts` do respectivo módulo, seguindo o padrão já estabelecido em `auth.docs.ts`.
   - **A documentação deve ser obrigatoriamente atualizada** sempre que ocorrerem mudanças no código que impactem o seu conteúdo (ex: novos campos, mudanças em mensagens de erro ou códigos de status HTTP).

### Identidade e Autenticação
- A barreira de proteção do sistema usará por padrão credenciais baseadas em **Email e Senha**.
- O fluxo de autorização contínua das requisições (autenticação) será gerido via Tokens **JWT (JSON Web Token)**.

### Stack do backend:
- **TypeScript**: Linguagem base fortemente tipada para trazer segurança ao Domínio.
- **Express**: Framework minimalista para lidar com a camada de *Presentation* HTTP.
- **PostgreSQL + Prisma**: Banco de dados relacional (provisionado e orquestrado via Docker Compose) mapeado e estruturado com o Prisma ORM.
- **Vitest**: Test runner primário extremamente veloz para a prática do TDD.
- **pnpm**: Gerenciador de pacotes raiz, muito rápido e focado em ecossistemas de monorepo.
- **ESLint**: Ferramenta de linting para garantir a qualidade e evitar erros.
- **Zod**: Biblioteca de validação de schema TypeScript-first. Todo input HTTP (`req.body`) deve ser validado por um Zod schema antes de chegar ao UseCase.
- **Swagger (OpenAPI 3.0)**: Documentação interativa das rotas HTTP, gerada automaticamente a partir dos Zod schemas via `@asteasolutions/zod-to-openapi`. Acessível em `/api/docs` em modo de desenvolvimento.

### Estrutura de Diretórios (`agora/backend/src/`)
- `core/`: Regras de negócio, entidades e tipagens abstratas exclusivas do domínio.
  - `entities/`: Interfaces TypeScript das entidades de negócio (ex: `User.ts`).
  - `repositories/`: Contratos (interfaces) dos repositórios de dados.
  - `providers/`: Contratos (interfaces) de serviços externos (hash, token, etc.).
- `application/`: Fluxos de Casos de Uso (orquestração do core).
  - `usecases/`: Classes de casos de uso (ex: `loginUseCase.ts`).
- `infrastructure/`: Implementação concreta do banco de dados (PostgreSQL via Prisma) e adaptadores externos.
  - `database/`: Cliente Prisma singleton e repositórios concretos (ex: `prismaUserRepository.ts`).
  - `providers/`: Implementações concretas dos providers (ex: `bcryptHashProvider.ts`, `jwtTokenProvider.ts`).
- `presentation/`: Mapeamento HTTP via rotas do Express e validações de input.
  - `controllers/`: Handlers HTTP que delegam para os UseCases.
  - `routes/`: Definição dos roteadores Express por domínio.
- `docs/`: Schemas Zod e documentação OpenAPI 3.0 das rotas HTTP.
  - `openapi.ts`: Registry central e gerador do documento OpenAPI.
  - `<dominio>.docs.ts`: Schemas e rotas documentadas por domínio (ex: `auth.docs.ts`).

### Response Standards

Para manter a consistência e facilitar o consumo pelo frontend, todas as respostas de erro devem seguir o padrão abaixo:

```json
{
  "message": "Human readable error summary",
  "errors": [ // Opcional, usado principalmente para validações
    { "field": "email", "message": "Invalid format" }
  ]
}
```

- **message**: Obrigatório. Uma string curta descrevendo o erro.
- **errors**: Opcional. Um array de objetos contendo o campo e a mensagem específica.

---

### Pipeline de Qualidade (obrigatória antes de qualquer commit ou entrega)

Toda alteração no código **deve obrigatoriamente passar pelas três etapas abaixo**, nesta ordem. Nenhuma entrega é válida se alguma das etapas falhar.

```bash
# 1. Lint — garante padrão de código, camelCase e ausência de erros estáticos
pnpm lint

# 2. Testes — valida todas as regras de negócio e contratos HTTP (TDD)
pnpm test

# 3. Build — confirma que o TypeScript compila sem erros para produção
pnpm build
```

> **Regra de ouro**: Se `pnpm lint && pnpm test && pnpm build` não passar com zero erros, o código não está pronto.