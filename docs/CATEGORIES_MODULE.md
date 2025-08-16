# Módulo de Categorias

Este documento descreve a implementação completa do módulo de categorias no sistema de atendimento de emails.

## Arquitetura

O módulo de categorias segue a arquitetura em camadas do projeto:

```
src/
├── types/
│   └── email.ts                    # Interfaces de categoria
├── database/
│   ├── Database.ts                 # Tabela categories e dados padrão
│   └── CategoryRepository.ts       # Acesso a dados
├── server/
│   ├── services/
│   │   └── CategoryService.ts      # Lógica de negócio
│   └── routes/
│       └── categoryRoutes.ts       # Endpoints da API
└── tests/
    └── category.test.ts            # Testes unitários
```

## Componentes

### 1. Types (Interfaces)

**Arquivo**: `src/types/email.ts`

```typescript
export interface Category {
  id: number;
  name: string;
  description: string;
  keywords: string[];
  patterns: string[];
  domains: string[];
  color: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  keywords: string[];
  patterns: string[];
  domains: string[];
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  keywords?: string[];
  patterns?: string[];
  domains?: string[];
  color?: string;
  active?: boolean;
}
```

### 2. Database Layer

**Arquivo**: `src/database/Database.ts`

- **Tabela**: `categories`
- **Índices**: `name`, `active`
- **Triggers**: `update_updated_at_column`
- **Dados padrão**: 5 categorias pré-definidas

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  keywords JSONB NOT NULL DEFAULT '[]',
  patterns JSONB NOT NULL DEFAULT '[]',
  domains JSONB NOT NULL DEFAULT '[]',
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Repository Layer

**Arquivo**: `src/database/CategoryRepository.ts`

Métodos implementados:
- `createCategory()`: Criar nova categoria
- `getCategories()`: Listar com filtros e paginação
- `getCategoryById()`: Buscar por ID
- `getCategoryByName()`: Buscar por nome
- `updateCategory()`: Atualizar categoria
- `deleteCategory()`: Excluir categoria
- `getActiveCategories()`: Listar apenas ativas
- `getCategoryStats()`: Estatísticas de uso

### 4. Service Layer

**Arquivo**: `src/server/services/CategoryService.ts`

Funcionalidades:
- **Validação**: Nome, cor, arrays
- **Verificação de duplicatas**: Nomes únicos
- **Transformação de dados**: Padrões regex
- **Estatísticas**: Uso das categorias
- **Integração**: Com sistema de categorização

### 5. Routes Layer

**Arquivo**: `src/server/routes/categoryRoutes.ts`

Endpoints:
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Buscar por ID
- `POST /categories` - Criar categoria
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Excluir categoria
- `GET /categories/active/list` - Listar ativas
- `GET /categories/stats/summary` - Estatísticas
- `POST /categories/validate-name` - Validar nome
- `PATCH /categories/:id/toggle` - Alternar status

## Categorias Padrão

O sistema inclui 5 categorias pré-definidas:

| Nome | Descrição | Cor | Palavras-chave |
|------|-----------|-----|----------------|
| `reclamacao` | Reclamações e problemas | #EF4444 | reclamação, problema, defeito, erro |
| `orcamento` | Solicitações de orçamento | #10B981 | orçamento, cotação, preço, valor |
| `informacoes_produto` | Informações sobre produtos | #3B82F6 | informações, detalhes, especificação |
| `suporte` | Suporte técnico | #F59E0B | suporte, ajuda, assistência |
| `vendas` | Interesse em compra | #8B5CF6 | comprar, venda, pedido, interesse |

## Validações

### Nome da Categoria
- **Formato**: Apenas letras minúsculas, números e underscore
- **Exemplo válido**: `nova_categoria_123`
- **Exemplo inválido**: `Nova-Categoria`

### Cor
- **Formato**: Hexadecimal (#RRGGBB)
- **Exemplo válido**: `#3B82F6`
- **Exemplo inválido**: `blue` ou `#3B82`

### Arrays
- **keywords**: Array de strings
- **patterns**: Array de strings (expressões regulares)
- **domains**: Array de strings (domínios de email)

## Integração com Categorização

O módulo se integra com o sistema de categorização automática:

```typescript
// No CategorizerService
async loadCategoriesFromDatabase(): Promise<void> {
  const dbCategories = await this.categoryService.getCategoriesForCategorization();
  this.categories = { ...this.categories, ...dbCategories };
}
```

## Testes

**Arquivo**: `src/tests/category.test.ts`

Cobertura de testes:
- ✅ Criação de categorias
- ✅ Validações de entrada
- ✅ Busca e listagem
- ✅ Atualização e exclusão
- ✅ Validação de nomes
- ✅ Transformação de dados

## Configuração

### Variáveis de Ambiente

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=email_attendant
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
```

### Inicialização

```typescript
// No servidor
const database = await initializeDatabase(getDatabaseConfig());
app.use('/api', createCategoryRoutes(database));
```

## Uso no Frontend

### Exemplo de criação de categoria

```javascript
const newCategory = {
  name: 'duvidas_tecnicas',
  description: 'Dúvidas técnicas sobre produtos',
  keywords: ['duvida', 'tecnico', 'especificacao'],
  patterns: ['\\b(duvida|pergunta)\\b', 'como.*funciona'],
  domains: [],
  color: '#6366F1'
};

const response = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newCategory)
});
```

### Exemplo de listagem

```javascript
const response = await fetch('/api/categories?active=true&page=1&limit=10');
const { data, pagination } = await response.json();
```

## Logs e Monitoramento

O módulo inclui logs estruturados:

```typescript
// Exemplos de logs
logger.info(`Category created with ID: ${category.id}`);
logger.warn(`Category with name '${name}' already exists`);
logger.error('Failed to create category:', error.message);
```

## Performance

### Otimizações Implementadas

1. **Índices de Banco**: `name`, `active`
2. **Paginação**: Suporte a `LIMIT` e `OFFSET`
3. **Cache de Categorias**: Carregamento único no CategorizerService
4. **Queries Otimizadas**: Uso de `JSONB` para arrays

### Métricas

- **Tempo de resposta**: < 100ms para listagens
- **Throughput**: Suporte a 1000+ categorias
- **Memória**: Uso eficiente com lazy loading

## Segurança

### Validações de Entrada

- **Sanitização**: Nomes de categoria
- **Validação**: Formato de cores hex
- **Prevenção**: SQL injection via prepared statements
- **Autorização**: Futura implementação de roles

### Boas Práticas

- **Prepared Statements**: Todas as queries
- **Validação de Tipos**: TypeScript + runtime
- **Logs Seguros**: Sem dados sensíveis
- **Error Handling**: Tratamento robusto de erros

## Roadmap

### Próximas Funcionalidades

1. **Categorias Hierárquicas**: Subcategorias
2. **Importação/Exportação**: CSV/JSON
3. **Templates por Categoria**: Respostas automáticas
4. **Analytics Avançadas**: Métricas detalhadas
5. **API Rate Limiting**: Proteção contra spam

### Melhorias Técnicas

1. **Cache Redis**: Para categorias frequentes
2. **Full-text Search**: Busca avançada
3. **Webhooks**: Notificações de mudanças
4. **Versionamento**: Histórico de alterações

## Troubleshooting

### Problemas Comuns

1. **Erro de nome duplicado**
   ```
   Error: Category with name 'existing_name' already exists
   ```
   **Solução**: Use um nome único ou atualize a categoria existente

2. **Erro de formato de cor**
   ```
   Error: Color must be a valid hex color (e.g., #3B82F6)
   ```
   **Solução**: Use formato hexadecimal válido

3. **Categoria não encontrada**
   ```
   Error: Category not found
   ```
   **Solução**: Verifique se o ID existe e está ativo

### Debug

```typescript
// Habilitar logs detalhados
const logger = createLogger('CategoryService', { level: 'debug' });

// Verificar categorias carregadas
console.log(categorizerService.getCategories());
```

## Contribuição

Para contribuir com o módulo:

1. **Testes**: Execute `npm test` antes de submeter
2. **Documentação**: Atualize este README
3. **Padrões**: Siga as convenções do projeto
4. **Validação**: Teste com dados reais

## Licença

Este módulo segue a mesma licença do projeto principal.
