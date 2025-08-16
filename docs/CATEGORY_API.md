# API de Categorias

Este documento descreve as APIs disponíveis para gerenciamento de categorias no sistema de atendimento de emails.

## Visão Geral

As categorias são usadas para classificar automaticamente os emails recebidos com base em palavras-chave, padrões regex e domínios de email. Cada categoria possui:

- **Nome**: Identificador único (apenas letras minúsculas, números e underscore)
- **Descrição**: Descrição detalhada da categoria
- **Palavras-chave**: Lista de palavras que identificam a categoria
- **Padrões**: Expressões regulares para matching mais preciso
- **Domínios**: Listas de domínios de email específicos
- **Cor**: Cor hexadecimal para identificação visual
- **Status**: Ativo/inativo

## Endpoints

### Base URL
```
http://localhost:3001/api
```

### 1. Listar Categorias

**GET** `/categories`

Lista todas as categorias com suporte a filtros e paginação.

#### Parâmetros de Query
- `page` (number, opcional): Página atual (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 50)
- `sortBy` (string, opcional): Campo para ordenação (padrão: 'name')
- `sortOrder` (string, opcional): Ordem ASC/DESC (padrão: 'ASC')
- `active` (boolean, opcional): Filtrar por status ativo
- `name` (string, opcional): Filtrar por nome (busca parcial)

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "reclamacao",
      "description": "Emails relacionados a reclamações e problemas",
      "keywords": ["reclamação", "reclamar", "problema", "defeito"],
      "patterns": ["\\b(problema|defeito|erro|falha)\\b"],
      "domains": [],
      "color": "#EF4444",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  }
}
```

### 2. Obter Categoria por ID

**GET** `/categories/:id`

Retorna uma categoria específica pelo ID.

#### Parâmetros
- `id` (number): ID da categoria

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "reclamacao",
    "description": "Emails relacionados a reclamações e problemas",
    "keywords": ["reclamação", "reclamar", "problema", "defeito"],
    "patterns": ["\\b(problema|defeito|erro|falha)\\b"],
    "domains": [],
    "color": "#EF4444",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Criar Categoria

**POST** `/categories`

Cria uma nova categoria.

#### Body
```json
{
  "name": "nova_categoria",
  "description": "Descrição da nova categoria",
  "keywords": ["palavra1", "palavra2"],
  "patterns": ["\\b(padrao1|padrao2)\\b"],
  "domains": ["exemplo.com"],
  "color": "#3B82F6"
}
```

#### Validações
- `name`: Obrigatório, apenas letras minúsculas, números e underscore
- `description`: Obrigatório
- `keywords`: Array de strings
- `patterns`: Array de strings (expressões regulares)
- `domains`: Array de strings
- `color`: Formato hexadecimal válido (#RRGGBB)

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "nova_categoria",
    "description": "Descrição da nova categoria",
    "keywords": ["palavra1", "palavra2"],
    "patterns": ["\\b(padrao1|padrao2)\\b"],
    "domains": ["exemplo.com"],
    "color": "#3B82F6",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

### 4. Atualizar Categoria

**PUT** `/categories/:id`

Atualiza uma categoria existente.

#### Parâmetros
- `id` (number): ID da categoria

#### Body
```json
{
  "name": "categoria_atualizada",
  "description": "Nova descrição",
  "keywords": ["nova_palavra"],
  "patterns": ["\\b(novo_padrao)\\b"],
  "domains": ["novo.com"],
  "color": "#10B981",
  "active": false
}
```

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "categoria_atualizada",
    "description": "Nova descrição",
    "keywords": ["nova_palavra"],
    "patterns": ["\\b(novo_padrao)\\b"],
    "domains": ["novo.com"],
    "color": "#10B981",
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Category updated successfully"
}
```

### 5. Excluir Categoria

**DELETE** `/categories/:id`

Remove uma categoria do sistema.

#### Parâmetros
- `id` (number): ID da categoria

#### Exemplo de Resposta
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### 6. Listar Categorias Ativas

**GET** `/categories/active/list`

Retorna apenas as categorias ativas, útil para dropdowns e seleções.

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "reclamacao",
      "description": "Emails relacionados a reclamações e problemas",
      "keywords": ["reclamação", "reclamar", "problema"],
      "patterns": ["\\b(problema|defeito|erro|falha)\\b"],
      "domains": [],
      "color": "#EF4444",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7. Estatísticas de Categorias

**GET** `/categories/stats/summary`

Retorna estatísticas de uso das categorias (quantidade de emails por categoria).

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "reclamacao",
      "emailCount": 25
    },
    {
      "categoryId": 2,
      "categoryName": "orcamento",
      "emailCount": 15
    }
  ]
}
```

### 8. Validar Nome de Categoria

**POST** `/categories/validate-name`

Valida se um nome de categoria é válido e disponível.

#### Body
```json
{
  "name": "nova_categoria"
}
```

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "valid": true
  }
}
```

#### Exemplo de Resposta (inválido)
```json
{
  "success": true,
  "data": {
    "valid": false,
    "message": "Category with name 'nova_categoria' already exists"
  }
}
```

### 9. Alternar Status da Categoria

**PATCH** `/categories/:id/toggle`

Alterna o status ativo/inativo de uma categoria.

#### Parâmetros
- `id` (number): ID da categoria

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "reclamacao",
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Category deactivated successfully"
}
```

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `404`: Categoria não encontrada
- `409`: Conflito (nome já existe)
- `500`: Erro interno do servidor

## Categorias Padrão

O sistema inclui as seguintes categorias padrão:

1. **reclamacao** (#EF4444): Reclamações e problemas
2. **orcamento** (#10B981): Solicitações de orçamento
3. **informacoes_produto** (#3B82F6): Informações sobre produtos
4. **suporte** (#F59E0B): Suporte técnico
5. **vendas** (#8B5CF6): Interesse em compra

## Exemplos de Uso

### Criar uma nova categoria
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "duvidas_tecnicas",
    "description": "Dúvidas técnicas sobre produtos",
    "keywords": ["duvida", "tecnico", "especificacao"],
    "patterns": ["\\b(duvida|pergunta)\\b", "como.*funciona"],
    "domains": [],
    "color": "#6366F1"
  }'
```

### Listar categorias com filtros
```bash
curl "http://localhost:3001/api/categories?active=true&page=1&limit=10"
```

### Atualizar categoria
```bash
curl -X PUT http://localhost:3001/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Nova descrição atualizada",
    "color": "#059669"
  }'
```

## Notas Importantes

1. **Nomes de Categoria**: Devem conter apenas letras minúsculas, números e underscore
2. **Cores**: Devem estar no formato hexadecimal (#RRGGBB)
3. **Padrões**: São expressões regulares em formato string
4. **Domínios**: Lista de domínios de email para matching específico
5. **Categorias Inativas**: Não são usadas na categorização automática de emails
6. **Exclusão**: Categorias com emails associados podem ser excluídas (considere desativar em vez de excluir)
